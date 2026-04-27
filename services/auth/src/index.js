const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000; 
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

const pool = new Pool({
  host: process.env.DB_HOST || "auth-db",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "auth_db"
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
  try {
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users(email, password, role) VALUES($1, $2, $3) RETURNING id, email, role",
      [email, hashed, role]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(400).json({ message: "User creation failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Auth running on port ${PORT}`));