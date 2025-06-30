const axios = require("axios");

// Cấu hình URL botpress (bạn có thể dùng env)
const BOTPRESS_URL = process.env.BOTPRESS_URL || "http://localhost:3001"; // Đổi thành domain nếu có

async function sendMessageToBotpress(botpress_bot_id, senderId, messageText) {
  try {
    const response = await axios.post(
      `${BOTPRESS_URL}/api/v1/bots/${botpress_bot_id}/converse/${senderId}`,
      {
        type: "text",
        text: messageText
      }
    );

    const replies = response.data.responses || [];

    console.log("✅ Đã gửi tin nhắn tới Botpress:", replies);
    return replies;
  } catch (err) {
    console.error("❌ Lỗi gửi tới Botpress:", err.message);
    return [];
  }
}

module.exports = { sendMessageToBotpress };
