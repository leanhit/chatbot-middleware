const express = require("express");
const router = express.Router();
const fbPages = require("../config/fbPages");
const { sendMessageToRasa } = require("../services/rasa");
const { sendMessageToFacebook } = require("../services/facebook");

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

  console.log("📬 Nhận webhook từ Facebook:", JSON.stringify(body, null, 2));

  if (body.object !== "page") return res.sendStatus(404);

  try {
    for (const entry of body.entry) {
      const pageId = entry.id;

      // Đảm bảo entry.messaging tồn tại
      if (!entry.messaging) continue;

      for (const event of entry.messaging) {
        const senderId = event.sender?.id;
        if (!senderId) continue;

        // 1. Xử lý tin nhắn dạng văn bản
        if (event.message?.text) {
          const message = event.message.text;
          console.log(`📩 [text] ${senderId}: ${message}`);

          const responses = await sendMessageToRasa(senderId, message);
          if (Array.isArray(responses)) {
            await Promise.all(responses.map(async r => {
              if (r.text) {
                try {
                  await sendMessageToFacebook(pageId, senderId, r.text);
                } catch (err) {
                  console.error("⚠️ Lỗi khi gửi tin nhắn về Facebook:", err);
                }
              }
            }));
          }
        }

        // 2. Xử lý postback (click nút)
        else if (event.postback?.payload) {
          const payload = event.postback.payload;
          console.log(`🟨 [postback] ${senderId}: ${payload}`);

          const responses = await sendMessageToRasa(senderId, payload);
          if (Array.isArray(responses)) {
            await Promise.all(responses.map(async r => {
              if (r.text) {
                try {
                  await sendMessageToFacebook(pageId, senderId, r.text);
                } catch (err) {
                  console.error("⚠️ Lỗi khi gửi postback về Facebook:", err);
                }
              }
            }));
          }
        }

        // 3. Xử lý đính kèm (ảnh, âm thanh, v.v.)
        else if (event.message?.attachments) {
          const types = event.message.attachments.map(a => a.type).join(", ");
          console.log(`📎 [attachments] ${senderId}: ${types}`);
          try {
            await sendMessageToFacebook(pageId, senderId, "Bot chưa hỗ trợ xử lý ảnh hoặc tệp tin.");
          } catch (err) {
            console.error("⚠️ Lỗi khi gửi phản hồi attachment:", err);
          }
        }

        // 4. Trường hợp không xác định
        else {
          console.log("🤷 Không xác định kiểu sự kiện:", JSON.stringify(event, null, 2));
        }
      }
    }

    // Facebook yêu cầu trả 200 để xác nhận đã nhận webhook
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Lỗi khi xử lý webhook:", error);
    res.sendStatus(500);
  }
});


module.exports = router;
