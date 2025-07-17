const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePic: {
    type: String,
    default: "", // Add default image URL if you want
  },
  bannerImage: {
    type: String,
    default: "",
  },
  profileText: {
    type: String,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);