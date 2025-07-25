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
    default: "",
  },
  bannerImage: {
    type: String,
    default: "",
  },
  profileText: {
    type: String,
    default: "",
  },
  animeHistory: [
    {
      id: String,
      title: String,
      image: String,
    }
  ],
  mangaHistory: [
    {
      id: String,
      title: String,
      image: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
