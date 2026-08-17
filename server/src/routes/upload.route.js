const express = require("express");
const { authMiddleware, authorizeRoleMiddleware } = require("../middlewares/auth.middleware.js");
const { getUploadSignatureController } = require("../controllers/upload.controller.js");

const router = express.Router();

router.get("/signature", authMiddleware, authorizeRoleMiddleware("owner"), getUploadSignatureController);

module.exports = router;
