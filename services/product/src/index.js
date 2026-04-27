const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Standardized port for all microservices inside Docker
const PORT = 3000; 
const BASE_API = process.env.EXTERNAL_API || "https://dummyjson.com";

const FALLBACK_PRODUCTS = [
  { id: 101, title: "iPhone 15", price: 999, thumbnail: "https://picsum.photos/seed/iphone15/400/300" },
  { id: 102, title: "Samsung Galaxy S24", price: 899, thumbnail: "https://picsum.photos/seed/galaxys24/400/300" },
  { id: 103, title: "Google Pixel 8", price: 799, thumbnail: "https://picsum.photos/seed/pixel8/400/300" },
  { id: 104, title: "MacBook Air M3", price: 1299, thumbnail: "https://picsum.photos/seed/macbookair/400/300" },
  { id: 105, title: "Sony WH-1000XM5", price: 399, thumbnail: "https://picsum.photos/seed/sonyxm5/400/300" }
];

// Routes
app.get("/", (_, res) => res.json({ status: "ok", message: "Product Service is Live" }));

app.get("/health", (_, res) => res.json({ status: "ok", service: "product" }));

app.get("/products", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_API}/products`, { timeout: 4000 });
    return res.json(response.data);
  } catch (err) {
    console.log("External API failed, serving fallback products");
    return res.json({ products: FALLBACK_PRODUCTS, source: "local-fallback" });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Product service successfully started on port ${PORT}`);
});