// userRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const { updateUserImage, updateUserBio } = require("../controllers/userController");
const userController = require("../controllers/userController");

// 🔄 Update profile or banner image
router.put("/update-image", authenticateToken, upload.single("image"), updateUserImage);

// 🆕 Update profile bio (profileText)
router.put("/update-bio", authenticateToken, updateUserBio);


// Watchlist routes
router.post("/remove-from-watchlist", userController.removeFromWatchlist);
router.get("/watchlist/:userId/:type", userController.getWatchlist);

module.exports = router;

