const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const BASE_API = process.env.EXTERNAL_API || "https://dummyjson.com";
const FALLBACK_PRODUCTS = [
  { id: 101, title: "iPhone 15", description: "Apple smartphone", price: 999, thumbnail: "https://picsum.photos/seed/iphone15/400/300" },
  { id: 102, title: "Samsung Galaxy S24", description: "Samsung flagship phone", price: 899, thumbnail: "https://picsum.photos/seed/galaxys24/400/300" },
  { id: 103, title: "Google Pixel 8", description: "Google AI-powered phone", price: 799, thumbnail: "https://picsum.photos/seed/pixel8/400/300" },
  { id: 104, title: "MacBook Air M3", description: "Lightweight Apple laptop", price: 1299, thumbnail: "https://picsum.photos/seed/macbookair/400/300" },
  { id: 105, title: "Sony WH-1000XM5", description: "Noise cancelling headphones", price: 399, thumbnail: "https://picsum.photos/seed/sonyxm5/400/300" },
  { id: 106, title: "Gaming Mouse Pro", description: "High precision RGB mouse", price: 79, thumbnail: "https://picsum.photos/seed/gamingmouse/400/300" }
];

const searchFallbackProducts = (search, limit) => {
  const normalized = String(search || "").trim().toLowerCase();
  const filtered = normalized
    ? FALLBACK_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          p.description.toLowerCase().includes(normalized)
      )
    : FALLBACK_PRODUCTS;
  return {
    products: filtered.slice(0, Number(limit) || 20),
    total: filtered.length,
    skip: 0,
    limit: Number(limit) || 20,
    source: "fallback"
  };
};

app.get("/health", (_, res) => res.json({ status: "ok", service: "product" }));

app.get("/products", async (req, res) => {
  const { search = "", limit = 20 } = req.query;
  try {
    const path = search
      ? `${BASE_API}/products/search?q=${encodeURIComponent(search)}`
      : `${BASE_API}/products?limit=${limit}`;
    const response = await axios.get(path, { timeout: 5000 });
    return res.json(response.data);
  } catch (err) {
    return res.json(searchFallbackProducts(search, limit));
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_API}/products/${req.params.id}`, { timeout: 5000 });
    return res.json(response.data);
  } catch (err) {
    const product = FALLBACK_PRODUCTS.find((p) => p.id === Number(req.params.id));
    if (product) return res.json(product);
    return res.status(404).json({ message: "Product not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Product service running on http://localhost:${PORT}`);
});
