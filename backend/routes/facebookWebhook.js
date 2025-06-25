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

      for (const event of entry.messaging) {
        const senderId = event.sender.id;

        // 1. Message text
        if (event.message?.text) {
          const message = event.message.text;
          console.log(`📩 [text] ${senderId}: ${message}`);

          const responses = await sendMessageToRasa(senderId, message);
          await Promise.all(responses.map(r =>
            r.text && sendMessageToFacebook(pageId, senderId, r.text)
          ));
        }

        // 2. Postback (button clicks)
        else if (event.postback?.payload) {
          const payload = event.postback.payload;
          console.log(`🟨 [postback] ${senderId}: ${payload}`);

          const responses = await sendMessageToRasa(senderId, payload);
          await Promise.all(responses.map(r =>
            r.text && sendMessageToFacebook(pageId, senderId, r.text)
          ));
        }

        // 3. Attachments (ảnh, âm thanh, v.v.)
        else if (event.message?.attachments) {
          const types = event.message.attachments.map(a => a.type).join(", ");
          console.log(`📎 [attachments] ${senderId}: ${types}`);
          await sendMessageToFacebook(pageId, senderId, "Bot chưa hỗ trợ xử lý ảnh hoặc tệp tin.");
        }

        // 4. Không xác định
        else {
          console.log("🤷 Không xác định message type:", event);
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
