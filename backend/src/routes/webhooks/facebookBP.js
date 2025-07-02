const express = require("express");
const router = express.Router();
const fbPages = require("@/config/fbPages");
const { sendMessageToBotpress } = require("@/services/botpress"); // Đổi tên module
const { sendMessageToFacebook } = require("@/services/facebook");

// Xác minh webhook từ Facebook
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const page = fbPages.find((p) => p.verify_token === token);
  console.log(`🔍 Xác minh webhook: mode=${mode}, token=${token}, challenge=${challenge}`);

  if (mode === "subscribe" && page) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Nhận và xử lý tin nhắn từ Facebook
router.post("/", async (req, res) => {
  const body = req.body;

  //console.log("📬 Nhận webhook từ Facebook:", JSON.stringify(body, null, 2));

  if (body.object !== "page") return res.sendStatus(404);

  try {
    for (const entry of body.entry) {
      const pageId = entry.id;
      const page = fbPages.find((p) => p.page_id === pageId);
      const botpress_bot_id = page?.botpress_bot_id;

      if (!entry.messaging) continue;

      for (const event of entry.messaging) {
        const senderId = event.sender?.id;
        if (!senderId) continue;

        // 1. Xử lý tin nhắn văn bản
        if (event.message?.text) {
          const message = event.message.text;
          console.log(`📩 [text] ${senderId}: ${message}`);

          const responses = await sendMessageToBotpress(botpress_bot_id, senderId, message); // ← dùng Botpress
          if (Array.isArray(responses)) {
            await Promise.all(responses.map(async (r) => {
              if (r.type === "text" && r.text) {
                try {
                  await sendMessageToFacebook(pageId, senderId, r.text);
                } catch (err) {
                  console.error("⚠️ Lỗi khi gửi tin nhắn về Facebook:", err);
                }
              }
            }));
          }
        }

        // 2. Postback (nút bấm)
        else if (event.postback?.payload) {
          const payload = event.postback.payload;
          console.log(`🟨 [postback] ${senderId}: ${payload}`);

          const responses = await sendMessageToBotpress(senderId, payload);
          if (Array.isArray(responses)) {
            await Promise.all(responses.map(async (r) => {
              if (r.type === "text" && r.text) {
                try {
                  await sendMessageToFacebook(pageId, senderId, r.text);
                } catch (err) {
                  console.error("⚠️ Lỗi khi gửi postback về Facebook:", err);
                }
              }
            }));
          }
        }

        // 3. Đính kèm (ảnh, tệp...)
        else if (event.message?.attachments) {
          const types = event.message.attachments.map(a => a.type).join(", ");
          console.log(`📎 [attachments] ${senderId}: ${types}`);
          try {
            await sendMessageToFacebook(pageId, senderId, "Bot chưa hỗ trợ xử lý ảnh hoặc tệp tin.");
          } catch (err) {
            console.error("⚠️ Lỗi khi gửi phản hồi attachment:", err);
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

module.exports = router;
