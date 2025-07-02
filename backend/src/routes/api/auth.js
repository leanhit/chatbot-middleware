const express = require("express");
const router = express.Router();
const authController = require("@/controllers/authController");

// Đăng nhập (trả về JWT)
router.post("/login", authController.login);

// (Tùy chọn) Đăng ký người dùng mới
router.post("/register", authController.register);

module.exports = router;
