const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000; 
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// IN-MEMORY STORAGE: Replaces the Postgres Pool
// Structure: { userId: [ {product1}, {product2} ] }
let carts = {};

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

// GET CART: Now reads from memory
app.get("/cart", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const userCart = carts[userId] || [];
  return res.json({ items: userCart });
});

// ADD TO CART: Now updates the memory object
app.post("/cart/add", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { productId, title, price, quantity = 1 } = req.body;

  if (!carts[userId]) carts[userId] = [];

  const existingItem = carts[userId].find(item => item.product_id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].push({ user_id: userId, product_id: productId, title, price, quantity });
  }

  return res.json({ items: carts[userId] });
});

// CLEAR CART: Memory cleanup
app.delete("/cart/clear", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ message: "User ID required" });

  carts[userId] = [];
  return res.json({ message: "Cart cleared", items: [] });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Cart service (Stateless) running on port ${PORT}`));