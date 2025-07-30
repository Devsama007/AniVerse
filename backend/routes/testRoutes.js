// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const { sendWeeklyDigest } = require("../controllers/newsLetterController");

// Manual trigger for digest email
router.get("/digest", async (req, res) => {
  try {
    await sendWeeklyDigest();
    res.status(200).json({ message: "✅ Weekly Digest sent manually." });
  } catch (error) {
    console.error("❌ Error sending digest manually:", error);
    res.status(500).json({ error: "Failed to send digest email." });
  }
});

module.exports = router;
