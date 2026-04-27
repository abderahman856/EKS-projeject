const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/health", (_, res) => res.json({ status: "ok", service: "payment" }));

app.post("/pay", (req, res) => {
  const { amount } = req.body;
  return res.json({
    status: amount > 0 ? "SUCCESS" : "FAILED",
    transaction_id: uuidv4()
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Payment running on port ${PORT}`));