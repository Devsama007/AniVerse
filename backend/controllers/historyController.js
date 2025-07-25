// backend/controllers/historyController.js
const User = require("../models/User");

const addToHistory = async (req, res) => {
  const userId = req.user.id;
  const { type, item } = req.body;

  if (!["anime", "manga"].includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const historyKey = type === "anime" ? "animeHistory" : "mangaHistory";

    // Remove if already exists
    user[historyKey] = user[historyKey].filter((entry) => entry.id !== item.id);

    // Add to beginning
    user[historyKey].unshift(item);

    // Limit to last 10
    user[historyKey] = user[historyKey].slice(0, 10);

    await user.save();
    res.status(200).json({ message: "History updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getUserHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      animeHistory: user.animeHistory || [],
      mangaHistory: user.mangaHistory || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addToHistory, getUserHistory };
