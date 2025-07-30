const express = require("express");
const router = express.Router();
const { addToWatchlist } = require("../controllers/watchListController");
const authenticateToken = require("../middleware/authMiddleware");

// POST route to add an item to watchlist
router.post("/add", authenticateToken, addToWatchlist);

module.exports = router;

