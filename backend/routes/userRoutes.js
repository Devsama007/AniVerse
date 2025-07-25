// userRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const { updateUserImage, updateUserBio } = require("../controllers/userController");

// 🔄 Update profile or banner image
router.put("/update-image", authenticateToken, upload.single("image"), updateUserImage);

// 🆕 Update profile bio (profileText)
router.put("/update-bio", authenticateToken, updateUserBio);

module.exports = router;

