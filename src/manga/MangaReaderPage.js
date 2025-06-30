import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./manga-styles/MangaReaderPage.css";

function MangaReaderPage() {
  const { id: anilistId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5000/api/manga/${anilistId}/chapters`);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        setChapters(data.chapters || []);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [anilistId]);

  const languages = Array.from(new Set(chapters.map((c) => c.language)));

  const filtered = languageFilter === "all"
    ? chapters
    : chapters.filter((c) => c.language === languageFilter);

  return (
    <div className="manga-reader-page">
      {loading ? (
        <p>Loading chapters…</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : chapters.length > 0 ? (
        <>
          <div className="chapters-header">
            <span>
              {filtered.length} chapters ({languageFilter === "all" ? "all languages" : languageFilter.toUpperCase()})
            </span>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <ul className="chapter-list">
            {filtered.map((c) => (
              <li key={c.id}>
                <Link to={`/manga/${anilistId}/chapter/${c.id}`}>
                  <div className="chapter-info">
                    <div>
                      Ch. {c.chapter}
                      {c.title && `: ${c.title}`}
                      <small> [{c.language.toUpperCase()}]</small>
                    </div>
                    <small>{new Date(c.publishAt).toLocaleDateString()}</small>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No chapters found for this manga.</p>
      )}
    </div>
  );
}

export default MangaReaderPage;
