// userController.js
const path = require("path");
const User = require("../models/User");

const updateUserImage = async (req, res) => {
  const userId = req.user.id;
  const type = req.body.type; // 'profilePic' or 'bannerImage'
  const file = req.file;

  if (!file || !["profilePic", "bannerImage"].includes(type)) {
    return res.status(400).json({ message: "Invalid request. Image or type missing." });
  }

  try {
    // Build image URL based on uploaded file
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

module.exports = { updateUserImage };

