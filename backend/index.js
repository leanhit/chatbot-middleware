require('module-alias/register');

const express = require("express");
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Webhook routes
app.use("/webhooks/facebook/rasa", require("@/routes/webhooks/facebookRS"));
app.use("/webhooks/facebook/botpress", require("@/routes/webhooks/facebookBP"));

// API routes
app.use("/api/auth", require("@/routes/api/auth"));
app.use("/api/info", require("@/routes/api/info"));

app.listen(3000, () => {
  console.log("Backend đang chạy tại http://localhost:3000");
});
