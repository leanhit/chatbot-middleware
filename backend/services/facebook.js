const axios = require("axios");
const fbPages = require("../config/fbPages");

async function sendMessageToFacebook(pageId, recipientId, messageText) {
  const config = fbPages.find(p => p.page_id === pageId);
  if (!config) {
    console.error(`❌ Không tìm thấy cấu hình cho page_id: ${pageId}`);
    return;
  }

  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${config.page_access_token}`;
  const payload = {
    recipient: { id: recipientId },
    message: { text: messageText }
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await axios.post(url, payload);
      console.log(`✅ Gửi tin nhắn tới ${recipientId} thành công`);
      return;
    } catch (err) {
      console.error(`⚠️ Lỗi gửi tin nhắn (attempt ${attempt}):`, err.response?.data || err.message);
    }
  }
}

module.exports = { sendMessageToFacebook };
