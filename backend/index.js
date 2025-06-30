const express = require("express");
const app = express();
const facebookWebhookRS = require("./routes/facebookWebhookRS"); // Đổi tên module
const facebookWebhookBP = require("./routes/facebookWebhookBP"); // Đổi tên module

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.use("/webhooks/facebook/rasa", facebookWebhookRS);
app.use("/webhooks/facebook/botpress", facebookWebhookBP);

app.listen(3000, () => {
  console.log("Backend đang chạy tại http://localhost:3000");
});
