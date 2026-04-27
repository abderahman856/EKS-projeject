const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/health", (_, res) => res.json({ status: "ok", service: "notification" }));

app.post("/notify", (req, res) => {
  console.log(`[Email Sent] to: ${req.body.to}`);
  return res.json({ status: "SENT" });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Notification running on port ${PORT}`));