const express = require("express");
const router = express.Router();
const configController = require("@/controllers/configController");

// Lấy danh sách configs
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
