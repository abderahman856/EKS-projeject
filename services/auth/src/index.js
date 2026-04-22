const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "auth_db"
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

app.get("/health", (_, res) => res.json({ status: "ok", service: "auth" }));

app.post("/signup", async (req, res) => {
  const { email, password, role = "user" } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users(email, password, role) VALUES($1, $2, $3) RETURNING id, email, role";
    const { rows } = await pool.query(query, [email, hashed, role]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(400).json({ message: "User creation failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const { rows } = await pool.query("SELECT id, email, password, role FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
});

app.get("/me", auth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, email, role FROM users WHERE id = $1", [req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: "User not found" });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
