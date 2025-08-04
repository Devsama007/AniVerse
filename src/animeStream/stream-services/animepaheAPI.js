// animeStream/stream-services/animepaheAPI.js

// For Searching
const BASE_URL = "http://localhost:5000/api/proxy";

// 🔍 Search anime by title
export const searchAnimeByTitle = async (title) => {
  const res = await fetch(`${BASE_URL}/search?title=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error("Failed to search AnimePahe");
  const data = await res.json();
  return data[0]?.animeId; // ✅ Use first result's animeId (like Comick's HID)
};



// 📺 Get episodes using AnimePahe ID
export const getEpisodesByAnimePaheId = async (animePaheId, page = 1) => {
  const res = await fetch(`${BASE_URL}/episodes/${animePaheId}?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  const data = await res.json();
  return data.data; // Only return the array of episodes
};

