const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000; 
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const carts = {};

const getUserId = (req) => {
  const serviceUser = req.headers["x-user-id"];
  if (serviceUser) return Number(serviceUser);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  return Number(jwt.verify(token, JWT_SECRET).id);
};

app.get("/health", (_, res) => res.json({ status: "ok", service: "cart" }));

app.get("/cart", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  return res.json({ items: carts[userId] || [] });
});

app.post("/cart/add", (req, res) => {
  const userId = getUserId(req);
  const { productId, title, price, quantity = 1 } = req.body;
  carts[userId] = carts[userId] || [];
  carts[userId].push({ productId, title, price, quantity });
  return res.json({ items: carts[userId] });
});

app.delete("/cart/clear", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (userId) carts[userId] = [];
  return res.json({ items: [] });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Cart running on port ${PORT}`));