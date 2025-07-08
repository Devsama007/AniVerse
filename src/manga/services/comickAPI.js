// manga/services/comickAPI.js

// Search manga by name and return its HID
export const searchMangaByName = async (title) => {
  const res = await fetch(`https://api.comick.fun/v1.0/search?q=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error("Failed to search manga");
  const data = await res.json();
  return data[0]?.hid; // return first match's HID
};

// Get all chapters of a manga using HID and optional language (e.g., 'en')
export const getChaptersByMangaHID = async (hid, lang = "en") => {
  const allChapters = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `https://api.comick.fun/comic/${hid}/chapters?lang=${lang}&page=${page}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch chapters (page ${page})`);
    }

    const data = await res.json();

    if (data?.chapters?.length > 0) {
      allChapters.push(...data.chapters);
      page++;
    } else {
      hasMore = false;
    }
  }

  // Sort by chapter number
  allChapters.sort((a, b) => parseFloat(a.chap) - parseFloat(b.chap));

  return allChapters;
};


// Fetch image URLs of a chapter using chapter HID
// comickAPI.js
export const getChapterImages = async (chapterHid) => {
  try {
    const res = await fetch(`https://api.comick.fun/chapter/${chapterHid}`);
    const data = await res.json();

    // ✅ Log correct structure
    console.log("✅ Full Chapter Response:", data);
    console.log("✅ md_images array:", data?.chapter?.md_images);

    const images = data?.chapter?.md_images;

    if (!images || images.length === 0) {
      console.warn("⚠️ No md_images found inside data.chapter");
      return [];
    }

    const urls = images.map((img) => `https://meo.comick.pictures/${img.b2key}`);
    return urls;
  } catch (err) {
    console.error("❌ Failed to fetch chapter images:", err);
    return [];
  }
};

// Fetch manga metadata or mangaHid 
export const getChapterMetadata = async (chapterHid) => {
  try {
    const response = await fetch(`https://api.comick.fun/chapter/${chapterHid}`);
    const data = await response.json();

    // Group chapters by scan group (origin)
    const chaptersByGroup = {};
    if (Array.isArray(data?.chapters)) {
      data.chapters.forEach((chapter) => {
        const group = chapter.group_name?.[0] || "Unknown";
        if (!chaptersByGroup[group]) {
          chaptersByGroup[group] = [];
        }
        chaptersByGroup[group].push(chapter);
      });
    }

    return {
      ...data,
      chaptersByGroup,
    };
  } catch (err) {
    console.error("Failed to fetch chapter metadata:", err);
    return null;
  }
};


