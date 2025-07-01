// ==============================
// AniVerse Backend Server
// ==============================

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // v2.x recommended for CommonJS

const app = express();
app.use(cors());
const PORT = 5000;

// =============================================
// 🔹 Fetch manga details from AniList GraphQL
// =============================================
async function getAniListManga(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        title {
          romaji
          english
        }
        externalLinks {
          site
          url
        }
      }
    }
  `;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id: Number(id) } }),
  });
  const json = await response.json();
  return json.data.Media;
}

// =============================================
// 🔹 Search MangaDex by manga title
// =============================================
async function searchMangaDex(title) {
  const searchUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1`;
  const res = await fetch(searchUrl);
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].id;
  }
  return null;
}

// =============================================
// 🔹 Fetch all MangaDex chapters for a manga ID
// =============================================
async function getMangaDexChapters(mangaDexId) {
  const allChapters = [];
  let offset = 0;
  const limit = 100;
  let batch = [];

  do {
    const url = `https://api.mangadex.org/chapter?manga=${mangaDexId}&translatedLanguage[]=en&order[chapter]=asc&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AniVerse/1.0 (contact@example.com)"
      }
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("MangaDex returned non-JSON response:", text.slice(0, 200));
      throw new Error("MangaDex API returned non-JSON (maybe rate-limited). Try again later.");
    }

    const json = await res.json();
    batch = json.data || [];
    allChapters.push(
      ...batch.map((c) => ({
        id: c.id,
        chapter: c.attributes.chapter || "Oneshot",
        title: c.attributes.title || "",
        language: c.attributes.translatedLanguage,
        publishAt: c.attributes.publishAt,
      }))
    );

    offset += batch.length;
  } while (batch.length === limit);

  return allChapters;
}

// =============================================
// 🔹 Search Comick by manga title
// =============================================
async function searchComickManga(title) {
  const searchUrl = `https://api.comick.io/v1.0/search?q=${encodeURIComponent(title)}`;
  const res = await fetch(searchUrl, {
    headers: {
      "User-Agent": "AniVerse/1.0 (+https://yourdomain.com)",
      "Accept": "application/json"
    }
  });

  if (!res.ok) throw new Error(`Comick search error: ${res.status}`);
  const json = await res.json();
  if (!json || !json.data || json.data.length === 0) return null;
  return json.data[0].hid;
}

// =============================================
// 🔹 Fetch all Comick chapters for a manga HID
// =============================================
async function getComickChapters(hid) {
  const chaptersUrl = `https://api.comick.io/v1.0/comic/${hid}`;
  const res = await fetch(chaptersUrl);
  if (!res.ok) throw new Error(`Comick chapters error: ${res.status}`);
  const json = await res.json();
  const chapters = json.chapters.map((c) => ({
    id: c.id,
    chapter: c.chapter,
    title: c.title,
    language: c.lang,
    publishAt: c.created_at,
  }));
  return chapters;
}

// =============================================
// 🔹 Main API Route: Get chapters from AniList + MangaDex + Comick
// =============================================
app.get("/api/manga/:anilistId/chapters", async (req, res) => {
  const anilistId = req.params.anilistId;
  try {
    console.log(`Fetching AniList manga with ID ${anilistId}`);
    const aniData = await getAniListManga(anilistId);

    let mangaDexId = null;
    const mdLink = aniData.externalLinks.find((l) => l.site === "MangaDex");
    if (mdLink) {
      console.log("Found MangaDex link:", mdLink.url);
      mangaDexId = mdLink.url.split("/")[4];
    } else {
      console.log("No MangaDex link. Searching MangaDex by title...");
      const title = aniData.title.english || aniData.title.romaji;
      mangaDexId = await searchMangaDex(title);
    }

    let chapters = [];
    if (mangaDexId) {
      try {
        chapters = await getMangaDexChapters(mangaDexId);
        console.log(`Found ${chapters.length} chapters on MangaDex`);
      } catch (e) {
        console.warn("Error fetching MangaDex chapters:", e);
        chapters = [];
      }
    }

    let fallbackTried = false;
    if (!chapters || chapters.length < 10) {
      console.log(`Only ${chapters?.length || 0} chapters found on MangaDex. Falling back to Comick...`);
      const title = aniData.title.english || aniData.title.romaji;
      const comickHid = await searchComickManga(title);
      fallbackTried = true;

      if (comickHid) {
        const comickChapters = await getComickChapters(comickHid);
        if (comickChapters && comickChapters.length > chapters.length) {
          console.log(`Using Comick: ${comickChapters.length} chapters`);
          chapters = comickChapters;
        } else {
          console.log(`Comick returned fewer or equal chapters (${comickChapters?.length || 0}) than MangaDex (${chapters?.length || 0})`);
        }
      } else {
        console.log("Comick fallback: No manga found on Comick.");
      }
    }

    // Final check before returning
    if (!chapters || chapters.length === 0) {
      return res.status(404).json({
        error: "No chapters found on MangaDex or Comick",
        fallbackTried
      });
    }

    res.json({ chapters });
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message || error.toString()
    });
  }
});


// =============================================
// 🔹 Start Express server
// =============================================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
