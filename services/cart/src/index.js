const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg"); // Added Postgres support
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000; 
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// Database Connection using Environment Variables
const pool = new Pool({
  host: process.env.DB_HOST || "cart-db",
  port: 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres", // Pulled from K8s Secret
  database: process.env.DB_NAME || "cart_db"
});

// Helper to extract User ID from JWT or Header
const getUserId = (req) => {
  const serviceUser = req.headers["x-user-id"];
  if (serviceUser) return Number(serviceUser);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return Number(decoded.id);
  } catch (err) {
    return null;
  }
};

app.get("/health", (_, res) => res.json({ status: "ok", service: "cart" }));

// GET CART: Now queries the Database
app.get("/cart", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { rows } = await pool.query("SELECT * FROM cart_items WHERE user_id = $1", [userId]);
    return res.json({ items: rows });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// ADD TO CART: Now persists to the Database
app.post("/cart/add", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { productId, title, price, quantity = 1 } = req.body;

  try {
    // Logic: If item exists, update quantity; otherwise, insert new.
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, title, price, quantity) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + $5`,
      [userId, productId, title, price, quantity]
    );

    const { rows } = await pool.query("SELECT * FROM cart_items WHERE user_id = $1", [userId]);
    return res.json({ items: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add item" });
  }
});

// CLEAR CART: Used by the Order service after successful payment
app.delete("/cart/clear", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ message: "User ID required" });

  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
    return res.json({ message: "Cart cleared", items: [] });
  } catch (err) {
    return res.status(500).json({ error: "Failed to clear cart" });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Cart service (Stateful) running on port ${PORT}`));