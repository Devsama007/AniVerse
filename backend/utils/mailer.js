// utils/mailer.js
const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (userEmail, username) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Aniverse" <${process.env.GMAIL_USER}>`,
            to: userEmail,
            subject: "✨ Welcome to Aniverse, Nakama!",
            html: `
  <div style="font-family:'Segoe UI', 'Noto Sans JP', Arial, sans-serif; background-color:#1a1a2e; color:#f8f8ff; padding:20px; border-radius:8px;">
    <h2 style="color:#08b6f3; font-size:24px;">🎌 Yo ${username}-kun! Welcome to <span style="color:#facc15;">Aniverse</span> 🌸</h2>
    <p style="font-size:16px;">
      We’re beyond hyped to have a new nakama join our anime world 🌍! Whether you're into heart-throbbing shounen battles, slice-of-life feels, or spine-chilling thrillers — we’ve got your back.
    </p>
    <p style="font-size:16px;">
      🔥 Binge the latest episodes<br/>
      📚 Catch up on your fav manga<br/>
      🌠 Discover hidden gems from every genre imaginable
    </p>
    <div style="margin:20px 0; padding:15px; background:#27293d; border-left:4px solid #ff0000ff; border-radius:6px;">
      <p style="margin:0; font-size:15px; font-style:italic;">
        "Power comes in response to a need, not a desire. You have to create that need." — Goku, *Dragon Ball Z*
      </p>
    </div>
    <p style="font-size:16px;">
      Your journey begins here, senpai. The Aniverse gates are open. 💫
    </p>
    <br/>
    <p style="font-size:15px;">Stay weeb. Stay wild.<br/>— Team Aniverse 💙</p>
  </div>
`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email sent to ${userEmail}`);
    } catch (error) {
        console.error("❌ Failed to send welcome email:", error);
    }
};

module.exports = sendWelcomeEmail;

