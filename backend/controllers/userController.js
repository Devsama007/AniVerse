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

module.exports = {
  updateUserImage,
  updateUserBio, 
};



