const express = require("express");
const router = express.Router();
const configServices = require('@/services/configServices');
const { sendMessageToBotpress } = require("@/services/botpress");
const { sendMessageToFacebook } = require("@/services/facebook");

// Xác minh webhook từ Facebook
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const page = configServices.getPageConfigByPageId(token);
  console.log(`🔍 Xác minh webhook: mode=${mode}, token=${token}, challenge=${challenge}`);

  if (mode === "subscribe" && page) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Nhận và xử lý tin nhắn từ Facebook
router.post("/", async (req, res) => {
  const body = req.body;

  if (body.object !== "page") return res.sendStatus(404);

  try {
    for (const entry of body.entry) {
      const pageId = entry.id;
      const page = await configServices.getPageConfigByPageId(pageId);
      console.log('page: ', page);
      const botpress_bot_id = page?.botpress_bot_id;

      if (!page || !botpress_bot_id) {
        console.warn(`⚠️ Không tìm thấy cấu hình trang hoặc botpress_bot_id cho pageId: ${pageId}`);
        continue;
      }

      if (!entry.messaging) continue;

      for (const event of entry.messaging) {
        const senderId = event.sender?.id;
        if (!senderId) continue;

        // 1. Xử lý tin nhắn văn bản
        if (event.message?.text) {
          const message = event.message.text;
          console.log(`📩 [text] ${senderId}: ${message}: ${botpress_bot_id}`);

          const responses = await sendMessageToBotpress(botpress_bot_id, senderId, message);

          if (Array.isArray(responses)) {
            for (const r of responses) {
              if (r.type === "text" && r.text) {
                try {
                  console.log(`📤 Gửi đến FB: [${pageId}] => ${senderId}: ${r.text}`);
                  await sendMessageToFacebook(pageId, senderId, r.text);
                } catch (err) {
                  handleFacebookSendError(err, senderId);
                }
              }
            }
          }
        }

        // 2. Postback (nút bấm)
        else if (event.postback?.payload) {
          const payload = event.postback.payload;
          //console.log(`🟨 [postback] ${senderId}: ${payload}`);

          const responses = await sendMessageToBotpress(botpress_bot_id, senderId, payload);

          if (Array.isArray(responses)) {
            for (const r of responses) {
              if (r.type === "text" && r.text) {
                try {
                  //console.log(`📤 Gửi postback đến FB: [${pageId}] => ${senderId}: ${r.text}`);
                  await sendMessageToFacebook(pageId, senderId, r.text);
                } catch (err) {
                  handleFacebookSendError(err, senderId);
                }
              }
            }
          }
        }

        // 3. Đính kèm (ảnh, file...)
        else if (event.message?.attachments) {
          const types = event.message.attachments.map(a => a.type).join(", ");
          //console.log(`📎 [attachments] ${senderId}: ${types}`);
          try {
            await sendMessageToFacebook(pageId, senderId, "Bot chưa hỗ trợ xử lý ảnh hoặc tệp tin.");
          } catch (err) {
            handleFacebookSendError(err, senderId);
          }
        }

        // 4. Không xác định
        else {
          console.log("🤷 Không xác định kiểu sự kiện:", JSON.stringify(event, null, 2));
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Lỗi khi xử lý webhook:", error);
    res.sendStatus(500);
  }
});

// Hàm xử lý lỗi gửi Facebook rõ ràng hơn
function handleFacebookSendError(err, senderId) {
  const errMsg = err?.error?.message || err.message || "Không rõ lỗi";
  const code = err?.error?.code;
  const subcode = err?.error?.error_subcode;

  if (code === 100 && subcode === 2018001) {
    console.warn(`🚫 Không thể gửi tin nhắn: Người dùng ${senderId} đã chặn hoặc không còn hợp lệ.`);
  } else {
    console.error(`⚠️ Lỗi khi gửi tin nhắn tới người dùng ${senderId}:`, errMsg);
  }
}

module.exports = router;
