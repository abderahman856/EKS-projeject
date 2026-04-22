const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3006;

app.get("/health", (_, res) => res.json({ status: "ok", service: "notification" }));

app.post("/notify", (req, res) => {
  const { to, subject, message } = req.body;
  console.log(`[Notification] to=${to || "unknown"} subject=${subject || "none"} message=${message || ""}`);
  return res.json({ status: "SENT" });
});

app.listen(PORT, () => {
  console.log(`Notification service running on http://localhost:${PORT}`);
});
