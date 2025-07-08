// manga/MangaView.js
// import React, { useEffect, useState } from "react";
// import "./manga-styles/MangaView.css";
// import { useParams } from "react-router-dom";
// import { getChapterImages } from "./services/comickAPI";
// import loadingGif from "../assets/rikka-takanashi.gif";

// manga/MangaView.js

import React, { useEffect, useState } from "react";
import "./manga-styles/MangaView.css";
import { useParams, useNavigate } from "react-router-dom";
import { getChapterImages, getChapterMetadata, getChaptersByMangaHID } from "./services/comickAPI";
import loadingGif from "../assets/rikka-takanashi.gif";

const MangaView = () => {
  const { chapterHid } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [chaptersByGroup, setChaptersByGroup] = useState({});

  const navigate = useNavigate();

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const imgs = await getChapterImages(chapterHid);
        setImages(imgs);
      } catch (err) {
        console.error("❌ Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [chapterHid]);

  // ✅ THIS IS YOUR OLD USEEFFECT (with smart group extraction)
useEffect(() => {
  const fetchMetadataAndFullChapterList = async () => {
    try {
      // Step 1: Get metadata of current chapter
      setLoading(true);  // ⏳ Show loading immediately
      const meta = await getChapterMetadata(chapterHid);
      console.log("✅ Current chapter metadata:", meta);

      const currentChap = meta?.chapter;
      setCurrentChapter(currentChap);

      // Step 2: Get manga HID from chapter metadata
      const mangaHID = currentChap?.md_comics?.hid;
      if (!mangaHID) throw new Error("❌ Manga HID not found in chapter metadata");

      // Step 3: Fetch full chapter list for that manga
      const allChapters = await getChaptersByMangaHID(mangaHID);
      console.log("✅ All chapters fetched:", allChapters.length);

      // Step 4: Group chapters by scanlation group
      const groupMap = {};
      allChapters.forEach((ch) => {
        const group = Array.isArray(ch.group_name) && ch.group_name.length > 0
          ? ch.group_name[0]
          : "Unknown";
        if (!groupMap[group]) groupMap[group] = [];
        groupMap[group].push(ch);
      });

      setChaptersByGroup(groupMap);
      console.log("✅ Grouped chapters by group:", groupMap);

      // Step 5: Detect current group using dupGroupChapters (fallback to group_map search)
      const detectedGroup = meta?.dupGroupChapters?.[0]?.group_name?.[0];

      const fallbackGroup = Object.keys(groupMap).find((group) =>
        groupMap[group].some((ch) => ch.hid === chapterHid)
      );

      const finalGroup = detectedGroup && groupMap[detectedGroup]
        ? detectedGroup
        : fallbackGroup || Object.keys(groupMap)[0];

      setSelectedGroup(finalGroup);

      // Step 6: Cover
      const coverKey = currentChap?.md_comics?.md_covers?.[0]?.b2key;
      if (coverKey) {
        setCoverImage(`https://meo.comick.pictures/${coverKey}`);
      }

    } catch (err) {
      console.error("❌ Error fetching manga view data:", err);
    } finally {
      setLoading(false);  // ✅ Hide loading once done
    }
  };

  fetchMetadataAndFullChapterList();
}, [chapterHid]);


  // Handle group change
  const handleGroupChange = (e) => {
    const newGroup = e.target.value;
    setSelectedGroup(newGroup);

    // Try to find same chapter number in this group
    const currentChapNum = currentChapter?.chap;
    const groupChapters = chaptersByGroup[newGroup] || [];
    const matching = groupChapters.find((c) => c.chap === currentChapNum);

    if (matching) {
      navigate(`/manga/${matching.hid}/read/${matching.hid}`);
    } else if (groupChapters.length > 0) {
      navigate(`/manga/${groupChapters[0].hid}/read/${groupChapters[0].hid}`);
    } else {
      console.warn(`⚠️ No chapters in group: ${newGroup}`);
    }
  };

  const handleChapterChange = (e) => {
    const newHid = e.target.value;
    navigate(`/manga/${newHid}/read/${newHid}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src={loadingGif} alt="Loading..." className="loading-gif" />
        <p>Loading Please Wait...</p>
      </div>
    );
  }

  return (
    <div className="manga-view-page">
      <div className="top-bar">
        <div className="top-bar-left">
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover Thumbnail"
              className="cover-thumbnail"
            />
          )}

          {/* Group Dropdown */}
          <select
            className="group-dropdown"
            value={selectedGroup}
            onChange={handleGroupChange}
          >
            {Object.keys(chaptersByGroup).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          {/* Chapter Dropdown */}
          <select
            className="chapter-dropdown"
            value={chapterHid}
            onChange={handleChapterChange}
          >
            {(chaptersByGroup[selectedGroup] || []).map((ch) => (
              <option key={ch.hid} value={ch.hid}>
                {`Ch ${ch.chap || "?"}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h2 className="chapter-title">
        {currentChapter?.title || `Chapter ${currentChapter?.chap || "?"}`}
      </h2>

      <div className="manga-pages">
        {images.length > 0 ? (
          images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Page ${idx + 1}`}
              className="manga-page"
            />
          ))
        ) : (
          <p className="manga-error">No pages found for this chapter.</p>
        )}
      </div>
    </div>
  );
};

export default MangaView;


