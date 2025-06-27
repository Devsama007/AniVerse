import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./manga-styles/MangaReaderPage.css";

function MangaReaderPage() {
  const { id: mangaId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState("all");

  useEffect(() => {
    const fetchFromMangaDex = async () => {
      let all = [];
      let offset = 0;
      const limit = 100;
      let batch = [];

      do {
        const url = new URL("https://api.mangadex.org/chapter");
        url.searchParams.set("manga", mangaId);
        url.searchParams.set("limit", limit);
        url.searchParams.set("offset", offset);
        url.searchParams.set("order[publishAt]", "desc");
        // Remove this if you want only "en": url.searchParams.append("translatedLanguage[]", "en");

        const res = await fetch(url);
        const json = await res.json();
        batch = json.data || [];
        all = all.concat(batch.map(item => ({
          id: item.id,
          chapter: item.attributes.chapter || "Oneshot",
          title: item.attributes.title || "",
          language: item.attributes.translatedLanguage,
          publishAt: item.attributes.publishAt,
        })));
        offset += batch.length;
      } while (batch.length === limit);

      return all;
    };

    const loadChapters = async () => {
      setLoading(true);
      const mdChapters = await fetchFromMangaDex();
      // Placeholder for fallback on Comick: await fetchFromComick();
      setChapters(mdChapters);
      setLoading(false);
    };

    loadChapters();
  }, [mangaId]);

  const languages = Array.from(new Set(chapters.map(c => c.language)));

  const filtered = languageFilter === "all"
    ? chapters
    : chapters.filter(c => c.language === languageFilter);

  return (
    <div className="manga-reader-page">
      {loading ? (
        <p>Loading chapters…</p>
      ) : chapters.length > 0 ? (
        <>
          <div className="chapters-header">
            <span>{filtered.length} chapters ({languageFilter === "all" ? "all languages" : languageFilter.toUpperCase()})</span>
            <select
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
            >
              <option value="all">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <ul className="chapter-list">
            {filtered.map((c, idx) => (
              <li key={c.id}>
                <Link to={`/manga/${mangaId}/chapter/${c.id}`}>
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