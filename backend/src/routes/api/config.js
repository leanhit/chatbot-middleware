//file config routes
const express = require("express");
const router = express.Router();
const configController = require("@/controllers/configController");
const jwtMiddleware = require('@/middlewares/jwtMiddleware'); // 👈 import

// ⚠️ Bảo vệ tất cả route
router.use(jwtMiddleware);

// Lấy danh sách configs của user
router.get("/", configController.view);

// Lấy config theo ID
router.get("/:id", configController.viewByID);

// Tạo mới config
router.post("/", configController.add);

// Cập nhật config theo ID
router.put("/:id", configController.edit);

// Xoá config theo ID
router.delete("/:id", configController.delete);

module.exports = router;
