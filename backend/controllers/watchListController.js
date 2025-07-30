const User = require("../models/User");

// Add to watchlist controller
exports.addToWatchlist = async (req, res) => {
  try {
    const { userId, item, type } = req.body;

    if (!type || !item || !item.id || !item.title || !item.image) {
      return res.status(400).json({ message: "Invalid request body" });
    }


    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const watchlistKey = type === "anime" ? "animeWatchlist" : "mangaWatchlist";

    // Check if item already exists
    const alreadyExists = user[watchlistKey].some((entry) => entry.id === item.id);
    if (alreadyExists) {
      return res.status(409).json({ message: "Item already in watchlist" });
    }

    user[watchlistKey].push({
      id: item.id,
      title: item.title,
      cover: item.image,
    });

    await user.save();

    return res.status(200).json({ message: "Item added to watchlist", watchlist: user[watchlistKey] });

  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
