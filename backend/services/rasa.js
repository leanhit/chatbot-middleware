const axios = require("axios");

// Đặt token nếu bạn đã cấu hình trong Rasa `credentials.yml`
const RASA_TOKEN = process.env.RASA_TOKEN || null;
const RASA_URL = process.env.RASA_URL || "http://localhost:5005";

async function sendMessageToRasa(senderId, messageText) {
  try {
    const headers = RASA_TOKEN
      ? { Authorization: `Bearer ${RASA_TOKEN}` }
      : {};

    const response = await axios.post(
      `${RASA_URL}/webhooks/rest/webhook`,
      { sender: senderId, message: messageText },
      { headers }
    );

    return response.data || [];
  } catch (err) {
    console.error("❌ Lỗi gửi tới Rasa:", err.message);
    return [];
  }
}

module.exports = { sendMessageToRasa };
