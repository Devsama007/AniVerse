// userController.js
const path = require("path");
const User = require("../models/User");

// Update profile or banner image
const updateUserImage = async (req, res) => {
  const userId = req.user.id;
  const type = req.body.type; // 'profilePic' or 'bannerImage'
  const file = req.file;

  if (!file || !["profilePic", "bannerImage"].includes(type)) {
    return res.status(400).json({ message: "Invalid request. Image or type missing." });
  }

  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [type]: imageUrl },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("❌ Error updating user image:", err.message, err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user bio (profileText)
const updateUserBio = async (req, res) => {
  const userId = req.user.id;
  const { profileText } = req.body;

  if (!profileText || typeof profileText !== "string") {
    return res.status(400).json({ message: "Bio must be a valid string." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileText },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("❌ Error updating bio:", err.message, err.stack);
    res.status(500).json({ message: "Server error" });
  }
};


// Watchlist requests
// ✅ Remove from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { userId, itemId, type } = req.body;

    if (!userId || !itemId || !type) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const watchlistKey = type === "anime" ? "animeWatchlist" : "mangaWatchlist";

    const initialLength = user[watchlistKey].length;

    console.log("Before removal:", user[watchlistKey].map(e => e.id));
    console.log("Trying to remove itemId:", itemId);

    user[watchlistKey] = user[watchlistKey].filter((entry) => entry.id.toString() !== itemId.toString());


    if (user[watchlistKey].length === initialLength) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }

    await user.save();

    return res.status(200).json({
      message: "Item removed from watchlist",
      watchlist: user[watchlistKey]
    });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get watchlist
const getWatchlist = async (req, res) => {
  try {
    const { userId, type } = req.params;

    if (!userId || !["anime", "manga"].includes(type)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const watchlistKey = type === "anime" ? "animeWatchlist" : "mangaWatchlist";
    return res.status(200).json({ watchlist: user[watchlistKey] });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateUserImage,
  updateUserBio,
  removeFromWatchlist,
  getWatchlist,
};



