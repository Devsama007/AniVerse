// backend/utils/buildDigestTemplate.js
const buildDigestTemplate = ({ animeList, mangaList }) => {
  const formatList = (items) =>
    items
      .map(
        (item) => `
      <li style="margin-bottom:10px;">
        <strong>${item.title}</strong><br/>
        <span style="font-size: 14px;">${item.description}</span><br/>
        <a href="${item.url}" target="_blank">View on AniList</a>
      </li>`
      )
      .join("");

  return `
     <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#0f172a; color:#f8fafc; padding:24px; border-radius:12px;">
    <h2 style="color:#facc15; text-align:center;">🌸 Welcome to the Aniverse Weekly Digest!</h2>
    <p style="font-size:16px; color:#e2e8f0; text-align:center;">
      Your portal to the latest anime & manga trends – straight from the Aniverse multiverse! ✨
    </p>

    <div style="margin-top:30px;">
      <h3 style="color:#60a5fa;">🔥 Top Trending Anime This Week</h3>
      <ul style="padding-left: 20px; color:#cbd5e1; font-size:15px;">
        ${formatList(animeList)}
      </ul>
    </div>

    <div style="margin-top:30px;">
      <h3 style="color:#34d399;">📖 Must-Read Manga Picks</h3>
      <ul style="padding-left: 20px; color:#cbd5e1; font-size:15px;">
        ${formatList(mangaList)}
      </ul>
    </div>

    <div style="margin-top: 40px; border-top:1px solid #334155; padding-top:20px; text-align:center;">
      <p style="color:#94a3b8; font-size:13px;">
        You’re receiving this because you're part of the Aniverse guild 🛡️<br/>
        Stay otaku. Stay awesome. 💫
      </p>
    </div>
  </div>
`;
};

module.exports = buildDigestTemplate;
