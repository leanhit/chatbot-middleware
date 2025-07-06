require('module-alias/register');

const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT_BACKEND || 3000;

app.use(express.json());

// 👉 CORS middleware
app.use((req, res, next) => {
  const allowedOrigin = 'https://admin.traloitudong.com';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Serve static files từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Route root trả về HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/public", "index.html"));
});

// Webhook routes
app.use("/webhooks/facebook/rasa", require("@/routes/webhooks/facebookRS"));
app.use("/webhooks/facebook/botpress", require("@/routes/webhooks/facebookBP"));

// API routes
app.use("/api/auth", require("@/routes/api/auth"));
app.use("/api/configs", require("@/routes/api/config"));

app.listen(PORT, () => {
  console.log(`✅ Backend đang chạy tại http://localhost:${PORT}`);
});
