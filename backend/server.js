const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // v2.x recommended for CommonJS

const app = express();
app.use(cors());
const PORT = 5000;

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

async function searchMangaDex(title) {
  const searchUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1`;
  const res = await fetch(searchUrl);
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].id;
  }
  return null;
}

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


app.get("/api/manga/:anilistId/chapters", async (req, res) => {
  const anilistId = req.params.anilistId;
  try {
    console.log(`Fetching AniList manga with ID ${anilistId}`);
    const aniData = await getAniListManga(anilistId);

    let mangaDexId = null;

    // Try extracting MangaDex link
    const mdLink = aniData.externalLinks.find((l) => l.site === "MangaDex");
    if (mdLink) {
      console.log("Found MangaDex link:", mdLink.url);
      mangaDexId = mdLink.url.split("/")[4];
    } else {
      // Fallback search
      console.log("No direct MangaDex link. Searching...");
      const title = aniData.title.english || aniData.title.romaji;
      mangaDexId = await searchMangaDex(title);
    }

    if (!mangaDexId) {
      return res.status(404).json({ error: "MangaDex ID not found" });
    }

    console.log("Using MangaDex ID:", mangaDexId);

    const chapters = await getMangaDexChapters(mangaDexId);

    res.json({ chapters });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));