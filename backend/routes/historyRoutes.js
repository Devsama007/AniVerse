// backend/routes/historyRoutes.js
const express = require("express");
const router = express.Router();
const { addToHistory, getUserHistory } = require("../controllers/historyController");

// ✅ Import default export
const authenticateToken = require("../middleware/authMiddleware");

router.post("/history", authenticateToken, addToHistory);
router.get("/history", authenticateToken, getUserHistory);


module.exports = router;

