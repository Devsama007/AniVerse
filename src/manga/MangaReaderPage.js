// manga/MangaReaderPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  searchMangaByName,
  getChaptersByMangaHID
} from "./services/comickAPI";
import "./manga-styles/MangaReaderPage.css";

const MangaReaderPage = () => {
  const { mangaTitle } = useParams();
  const [chapters, setChapters] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(60);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const hid = await searchMangaByName(mangaTitle);
        if (!hid) throw new Error("No manga found");

        const allChapters = await getChaptersByMangaHID(hid, "en");
        setTotal(allChapters.length);
        setChapters(allChapters);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaTitle]);

  const indexOfLast = currentPage * chaptersPerPage;
  const indexOfFirst = indexOfLast - chaptersPerPage;
  const currentChapters = chapters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);

  const handleClick = (chapter) => {
    navigate(`/manga/${mangaTitle}/read/${chapter.hid}`);
  };

  return (
    <div className="reader-page">
      <h2>Chapters for: {mangaTitle}</h2>

      {loading ? (
        <p className="loading">Loading chapters...</p>
      ) : (
        <>
          <div className="chapter-list">
            {currentChapters.map((chap, idx) => (
              <div
                key={chap.hid}
                className="chapter-row"
                onClick={() => handleClick(chap)}
              >
                <div className="flag">{chap.lang.toUpperCase()}</div>
                <div className="title">
                  <strong>{chap.title || `Ch. ${chap.chap}`}</strong>
                </div>
                <div className="meta">
                  <span>{chap.created_at ? new Date(chap.created_at).toDateString() : "Unknown"}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </button>
            {[...Array(totalPages).keys()].slice(0, 7).map((n) => (
              <button
                key={n + 1}
                className={currentPage === n + 1 ? "active" : ""}
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
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

