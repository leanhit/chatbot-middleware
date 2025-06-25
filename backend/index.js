const express = require("express");
const app = express();
const facebookWebhook = require("./routes/facebookWebhook");

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.use("/webhooks/facebook/webhook", facebookWebhook);

app.listen(3000, () => {
  console.log("Backend đang chạy tại http://localhost:3000");
});
