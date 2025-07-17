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
import jsPDF from "jspdf";

const MangaView = () => {
  const { chapterHid } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [chaptersByGroup, setChaptersByGroup] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // =========Fetch manga pages===========
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

  // ======= Fetching Metadata and Chapter List
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

        const savedGroup = localStorage.getItem("preferredGroup");

        const fallbackGroup = Object.keys(groupMap).find((group) =>
          groupMap[group].some((ch) => ch.hid === chapterHid)
        );

        const finalGroup =
          savedGroup && groupMap[savedGroup]
            ? savedGroup
            : detectedGroup && groupMap[detectedGroup]
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


  // ========== Handle Page Jumping===========
  const handleGroupChange = (e) => {
    const newGroup = e.target.value;
    setSelectedGroup(newGroup);
    localStorage.setItem("preferredGroup", newGroup);

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


  //========Dynamic Top Bar=========
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80); // Change 80px as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  //=========Bottom Buttons========== 
  const groupChapters = chaptersByGroup[selectedGroup] || [];
  const currentIndex = groupChapters.findIndex((ch) => ch.hid === chapterHid);

  const prevChapter = groupChapters[currentIndex - 1];
  const nextChapter = groupChapters[currentIndex + 1];

  // =======Scroll Progrese Bar========
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  //========Reading Mode and Toggle Handler zoom in and out========
  const [zoom, setZoom] = useState(() => {
    return parseFloat(localStorage.getItem("zoomLevel")) || 1;
  });

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2); // max 200%
    setZoom(newZoom);
    localStorage.setItem("zoomLevel", newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.05); // min 5%
    setZoom(newZoom);
    localStorage.setItem("zoomLevel", newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    localStorage.setItem("zoomLevel", 1);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };


  // ========Mouse Hovering========
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 80) {
        setIsScrolled(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  //========PDF Downloading Button========
  const downloadChapterAsPDF = async () => {
    if (images.length === 0) {
      alert("No pages to download.");
      return;
    }

    const mmPerPixel = 0.264583;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    // ✅ 1. Add COVER PAGE first
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F"); // white background

    const title =
      currentChapter?.md_comics?.title ||
      currentChapter?.md_comics?.alt_titles?.[0] ||
      "Manga";

    const chapterNum = currentChapter?.chap || "N/A";

    // ✅ Title Text
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.text(title, pageWidth / 2, 20, { align: "center" });

    // ✅ Chapter Number
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(16);
    pdf.text(`Chapter ${chapterNum}`, pageWidth / 2, 32, { align: "center" });

    // ✅ Cover Image
    if (coverImage) {
      const cover = new Image();
      cover.crossOrigin = "Anonymous";
      cover.src = coverImage;

      await new Promise((resolve) => {
        cover.onload = () => {
          const imgAspect = cover.width / cover.height;
          const maxImgWidth = pageWidth * 0.75;
          const imgWidth = maxImgWidth;
          const imgHeight = imgWidth / imgAspect;

          const x = (pageWidth - imgWidth) / 2;
          const y = 50;

          const canvas = document.createElement("canvas");
          canvas.width = cover.width;
          canvas.height = cover.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(cover, 0, 0);

          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
          resolve();
        };
      });
    }

    // ✅ Footer Watermark
    pdf.setFontSize(16);
    pdf.setTextColor(212, 175, 55);
    pdf.text("Downloaded by AniVerse", pageWidth - 30, pageHeight - 10);

    // ✅ 2. Now add actual manga pages
    for (let i = 0; i < images.length; i++) {
      const imgUrl = images[i];
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;

      await new Promise((resolve) => {
        img.onload = () => {
          const imgWidthMM = img.width * mmPerPixel;
          const imgHeightMM = img.height * mmPerPixel;

          pdf.addPage([imgWidthMM, imgHeightMM]);
          pdf.setPage(i + 2); // Because page 1 is cover

          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", 0, 0, imgWidthMM, imgHeightMM);

          // Watermark per page
          pdf.setTextColor(212, 175, 55);
          pdf.setFontSize(16);
          pdf.text("Downloaded by AniVerse", imgWidthMM - 30, imgHeightMM - 10);

          resolve();
        };
      });
    }

    // ✅ Filename
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "");

    const filename = `${safeTitle}_Chapter_${chapterNum}.pdf`;
    pdf.save(filename);
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

    <>
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="manga-view-page">
        <div className={`top-bar ${isScrolled ? "scrolled" : ""}`}>
          <div className="top-bar-left">
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover Thumbnail"
                className={`cover-thumbnail ${isScrolled ? "hidden" : ""}`}
                onClick={() => {
                  const title =
                    currentChapter?.md_comics?.title ||
                    currentChapter?.md_comics?.alt_titles?.[0];

                  if (title) {
                    const encoded = encodeURIComponent(title);
                    navigate(`/manga/title/${encoded}`);
                  } else {
                    console.warn("❌ No title found for navigation");
                  }
                }}

              />
            )}

            {/* Group Dropdown */}
            <select
              className={`group-dropdown ${isScrolled ? "hidden" : ""}`}
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
              className={`chapter-dropdown ${isScrolled ? "hidden" : ""}`}
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

          <div className={`zoom-controls ${isScrolled ? "hidden" : "visible"}`}>
            <button onClick={handleZoomOut}>−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn}>+</button>
            <button onClick={resetZoom}>Reset</button>
            <button onClick={() => toggleFullScreen()}>
              {document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen"}
            </button>
            <button onClick={downloadChapterAsPDF}>
              Download
            </button>
          </div>


        </div>


        <h2 className="chapter-title">
          {currentChapter?.title || `Chapter ${currentChapter?.chap || "?"}`}
        </h2>

        {/*  Manga Pages */}
        <div className="manga-pages" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
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


        <div className="chapter-nav-buttons">
          {/* Left - Prev */}
          {prevChapter ? (
            <div className="nav-button left" onClick={() => navigate(`/manga/${prevChapter.hid}/read/${prevChapter.hid}`)}>
              <div className="nav-arrow">←</div>
              <div>
                <div className="nav-label">Prev</div>
                <div className="nav-chapter">{`Ch. ${prevChapter.chap || "?"}`}</div>
              </div>
            </div>
          ) : <div className="nav-button empty" />}

          {/* Divider */}
          <div className="nav-divider" />

          {/* Right - Next */}
          {nextChapter ? (
            <div className="nav-button right" onClick={() => navigate(`/manga/${nextChapter.hid}/read/${nextChapter.hid}`)}>
              <div>
                <div className="nav-label">Next</div>
                <div className="nav-chapter">{`Ch. ${nextChapter.chap || "?"}`}</div>
              </div>
              <div className="nav-arrow">→</div>
            </div>
          ) : <div className="nav-button empty" />}
        </div>

      </div>
    </>
  );
};

export default MangaView;


