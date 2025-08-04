// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
require("dotenv").config();

// Weekly digest
const { sendWeeklyDigest } = require("./controllers/newsLetterController");

// dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// User Profile edit
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

//User History
console.log("Registering route: /api/user/history");
app.use("/api/user", require("./routes/historyRoutes"));

// Serve static files from uploads/

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Test Digest Trigger Route
app.use("/api/test", require("./routes/testRoutes"));


// Watch List Routes, adding Anime and Manga
const watchListRoutes = require("./routes/watchListRoutes");
app.use("/api/watchlist", watchListRoutes);


// ✅ Register AnimePahe Proxy Server
const proxyRoutes = require("./proxy-server/proxy-server");
app.use("/api/proxy", proxyRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Weekly Digest Cron Job - Every Monday 10:00 AM IST
cron.schedule("0 10 * * 1", async () => {
  console.log("📬 Sending weekly digest emails...");
  await sendWeeklyDigest();
}, {
  timezone: "Asia/Kolkata",
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


