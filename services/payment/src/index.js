const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;

app.get("/health", (_, res) => res.json({ status: "ok", service: "payment" }));

app.post("/pay", (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== "number") {
    return res.status(400).json({ status: "FAILED", message: "Amount is required" });
  }

  if (amount > 0) {
    return res.json({
      status: "SUCCESS",
      transaction_id: uuidv4()
    });
  }

  return res.json({
    status: "FAILED",
    transaction_id: null
  });
});

app.listen(PORT, () => {
  console.log(`Payment service running on http://localhost:${PORT}`);
});
