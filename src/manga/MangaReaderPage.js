// manga/MangaReaderPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  searchMangaByName,
  getChaptersByMangaHID,
} from "./services/comickAPI";
import "./manga-styles/MangaReaderPage.css";
import loadingGif from "../assets/rikka-takanashi.gif";
import { LANGUAGE_OPTIONS } from "./services/languageOptions";
import FlagMap from "./manga-components/FlagMap"


const MangaReaderPage = () => {
  const { mangaTitle } = useParams();
  const [chapters, setChapters] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 60;
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState("en");


  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const hid = await searchMangaByName(mangaTitle);
        if (!hid) throw new Error("No manga found");

        const allChapters = await getChaptersByMangaHID(hid, selectedLang);

        // ✅ Deduplicate by chap number, keeping the version with a title if possible
        const chapterMap = new Map();

        for (const chap of allChapters) {
          if (!chap.chap) continue;

          const chapNum = parseFloat(chap.chap);
          if (isNaN(chapNum)) continue;

          const existing = chapterMap.get(chapNum);

          if (!existing || (chap.title && !existing.title)) {
            chapterMap.set(chapNum, chap);
          }
        }

        const uniqueChapters = Array.from(chapterMap.entries())
          .sort((a, b) => b[0] - a[0]) // Sort by chapter number (key)
          .map(([_, chap]) => chap);   // Return only the chapter data

        setTotal(uniqueChapters.length);
        setChapters(uniqueChapters);

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaTitle, selectedLang]);



  const totalChapters = chapters.length;
  const totalPages = Math.ceil(totalChapters / chaptersPerPage);
  const indexOfLast = currentPage * chaptersPerPage;
  const indexOfFirst = indexOfLast - chaptersPerPage;
  const currentChapters = chapters.slice(indexOfFirst, indexOfLast);

  const handleClick = (chapter) => {
    navigate(`/manga/${mangaTitle}/read/${chapter.hid}`);
  };

  return (
    <div className="reader-page">
      <h2>Chapters for: {mangaTitle}</h2>

      {loading ? (
        <div className="loading-container">
          <img src={loadingGif} alt="Loading..." className="loading-gif" />
          <p>Loading Please Wait...</p>
        </div>
      ) : (
        <>

          <div className="lang-select-container">
            <label htmlFor="lang-select">🌐 Select Language: </label>
            <div className="select-wrapper">
              <img
                src={FlagMap[selectedLang] || FlagMap.en}
                alt={selectedLang}
                className="lang-flag"
              />
              <select
                id="lang-select"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="chapter-list">
            {currentChapters.map((chap) => (
              <div
                key={chap.hid}
                className="chapter-row"
                onClick={() => handleClick(chap)}
              >
                <div className="flag">{chap.lang.toUpperCase()}</div>
                <div className="title">
                  <strong>
                    {`Ch. ${chap.chap || "?"}${chap.title ? ` - ${chap.title}` : ""}`}
                  </strong>
                </div>

                <div className="meta">
                  <span>
                    {chap.created_at
                      ? new Date(chap.created_at).toDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹ Previous
            </button>

            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : prev
                )
              }
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>
          </div>

          <div className="chapter-count">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, total)} of {total} items
          </div>

        </>
      )}
    </div>
  );
};

export default MangaReaderPage;
