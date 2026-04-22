const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

const carts = {};

const getUserId = (req) => {
  const serviceUser = req.headers["x-user-id"];
  if (serviceUser) return Number(serviceUser);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  const payload = jwt.verify(token, JWT_SECRET);
  return Number(payload.id);
};

app.get("/health", (_, res) => res.json({ status: "ok", service: "cart" }));

app.post("/cart/add", (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { productId, title, price, thumbnail, quantity = 1 } = req.body;
    if (!productId || !title || typeof price !== "number") {
      return res.status(400).json({ message: "Invalid product payload" });
    }

    carts[userId] = carts[userId] || [];
    const existing = carts[userId].find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity <= 0) {
        carts[userId] = carts[userId].filter((item) => item.productId !== productId);
      }
    } else if (quantity > 0) {
      carts[userId].push({ productId, title, price, thumbnail, quantity });
    }

    return res.json({ items: carts[userId] || [] });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

app.post("/cart/update", (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) return res.status(400).json({ message: "Invalid payload" });
    carts[userId] = carts[userId] || [];
    carts[userId] = carts[userId].map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    return res.json({ items: carts[userId] });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

app.get("/cart", (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    return res.json({ items: carts[userId] || [] });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

app.delete("/cart/remove", (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { productId } = req.body;
    carts[userId] = (carts[userId] || []).filter((item) => item.productId !== productId);
    return res.json({ items: carts[userId] });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

app.delete("/cart/clear", (req, res) => {
  const userId = Number(req.headers["x-user-id"]);
  if (!userId) return res.status(400).json({ message: "x-user-id is required" });
  carts[userId] = [];
  return res.json({ items: [] });
});

app.listen(PORT, () => {
  console.log(`Cart service running on http://localhost:${PORT}`);
});
