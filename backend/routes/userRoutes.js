// userRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const { updateUserImage } = require("../controllers/userController");

router.put("/update-image", authenticateToken, upload.single("image"), updateUserImage);

module.exports = router;

