const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3004;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

const CART_URL = process.env.CART_URL || "http://localhost:3003";
const PAYMENT_URL = process.env.PAYMENT_URL || "http://localhost:3005";
const NOTIFICATION_URL = process.env.NOTIFICATION_URL || "http://localhost:3006";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "order_db"
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/health", (_, res) => res.json({ status: "ok", service: "order" }));

app.post("/orders", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const email = req.user.email;
    const cartResp = await axios.get(`${CART_URL}/cart`, {
      headers: { "x-user-id": String(userId) }
    });

    const items = cartResp.data.items || [];
    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const paymentResp = await axios.post(`${PAYMENT_URL}/pay`, { amount: totalAmount });
    const paymentStatus = paymentResp.data.status === "SUCCESS" ? "PAID" : "FAILED";

    await client.query("BEGIN");
    const insertOrder = `
      INSERT INTO orders(user_id, total_amount, status, transaction_id)
      VALUES($1, $2, $3, $4)
      RETURNING id, user_id, total_amount, status, transaction_id, created_at
    `;
    const orderResult = await client.query(insertOrder, [
      userId,
      totalAmount,
      paymentStatus,
      paymentResp.data.transaction_id
    ]);
    const order = orderResult.rows[0];

    const insertItem = `
      INSERT INTO order_items(order_id, product_id, title, price, quantity)
      VALUES($1, $2, $3, $4, $5)
    `;
    for (const item of items) {
      await client.query(insertItem, [
        order.id,
        item.productId,
        item.title,
        item.price,
        item.quantity
      ]);
    }
    await client.query("COMMIT");

    await axios.delete(`${CART_URL}/cart/clear`, {
      headers: { "x-user-id": String(userId) }
    });
    await axios.post(`${NOTIFICATION_URL}/notify`, {
      to: email,
      subject: "Order Created",
      message: `Your order #${order.id} is ${order.status}`
    });

    return res.status(201).json({ order, items });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Order creation failed", error: err.message });
  } finally {
    client.release();
  }
});

app.get("/orders", auth, async (req, res) => {
  try {
    const orderQuery = `
      SELECT id, user_id, total_amount, status, transaction_id, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows: orders } = await pool.query(orderQuery, [req.user.id]);
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Order service running on http://localhost:${PORT}`);
});
