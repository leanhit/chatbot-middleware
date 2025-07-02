const express = require("express");
const router = express.Router();
const infoController = require("@/controllers/infoController");

router.post("/add", infoController.add);

router.post("/edit:id", infoController.edit);

router.get("/view", infoController.view);

router.get("/view:id", infoController.viewByID);

router.delete("/delete:id", infoController.delete);

module.exports = router;
