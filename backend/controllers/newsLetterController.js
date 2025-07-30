// backend/controllers/newsletterController.js
const nodemailer = require("nodemailer");
const User = require("../models/User");
const buildDigestTemplate = require("../utils/buildDigestTemplate");
const fetchTrendingFromAniList = require("../utils/fetchAniListTrending");

const sendWeeklyDigest = async () => {
  try {
    const users = await User.find({}, "email username");

    const [animeList, mangaList] = await Promise.all([
      fetchTrendingFromAniList("ANIME"),
      fetchTrendingFromAniList("MANGA"),
    ]);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const user of users) {
      const mailOptions = {
        from: `"Aniverse Weekly" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: `📬 Your Aniverse Weekly Digest is Here, ${user.username}!`,
        html: buildDigestTemplate({ animeList, mangaList }),
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Digest sent to: ${user.email}`);
    }
  } catch (error) {
    console.error("❌ Failed to send digest:", error.message);
  }
};

module.exports = { sendWeeklyDigest };
