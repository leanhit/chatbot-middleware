const express = require("express");
const router = express.Router();
const configServices = require('@/services/configServices');
const { sendMessageToBotpress } = require('@/services/botpress');
const axios = require('axios');

// Chatwoot webhook
router.post("/", async (req, res) => {
  const payload = req.body;

  if (!payload || !payload.content || payload.message_type !== 'incoming') {
    return res.sendStatus(200); // Bỏ qua không cần xử lý
  }

  const inbox_id = payload.conversation.inbox.id;
  const conversation_id = payload.conversation.id;

  try {
    const cwConfig = await configServices.getChatwootConfigByInboxId(inbox_id);
    if (!cwConfig) {
      console.warn(`❌ Không tìm thấy cấu hình Chatwoot cho inbox_id: ${inbox_id}`);
      return res.sendStatus(404);
    }

    const page_id = payload.additional_attributes?.page_id;
    const bpConfig = await configServices.getPageConfigByPageId(page_id);

    if (!bpConfig || !bpConfig.botpress_bot_id) {
      console.warn(`❌ Không tìm thấy Botpress config cho page_id: ${page_id}`);
      return res.sendStatus(404);
    }

    const botUserId = `cw_${conversation_id}`;
    const messageText = payload.content;

    const responses = await sendMessageToBotpress(bpConfig.botpress_bot_id, botUserId, messageText);

    if (!responses || !Array.isArray(responses)) {
      console.warn(`⚠️ Botpress không phản hồi hoặc lỗi`);
      return res.sendStatus(200);
    }

    for (const r of responses) {
      if (r.type === 'text' && r.text) {
        const sendUrl = `${cwConfig.api_base_url}/api/v1/accounts/${cwConfig.account_id}/conversations/${conversation_id}/messages`;
        await axios.post(sendUrl, {
          content: r.text,
          message_type: 'outgoing',
        }, {
          headers: {
            api_access_token: cwConfig.api_access_token,
          },
        });
        console.log(`📤 Gửi trả Chatwoot [${inbox_id}] => ${r.text}`);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Lỗi xử lý Chatwoot webhook:", err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
