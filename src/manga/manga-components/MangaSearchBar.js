import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../manga-styles/MangaSearchBar.css";

const MangaSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const debounceTimeout = useRef();

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);

    const gqlQuery = `
      query ($search: String) {
        Page(perPage: 5) {
          media(search: $search, type: MANGA) {
            id
            title {
              english
              romaji
            }
            coverImage {
              medium
            }
            format
            chapters
            genres
          }
        }
      }
    `;

    const variables = { search: searchTerm };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: gqlQuery, variables }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const json = await res.json();

      const filtered = (json?.data?.Page?.media || []).filter(
        (manga) => Array.isArray(manga.genres) && !manga.genres.includes("Hentai")
      );

      setResults(filtered);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err.message);
      setResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/manga/${id}`);
    setShowDropdown(false);
  };

const handleViewAll = () => {
  navigate(`/manga/search/${query}`);
  setShowDropdown(false);
};

  useEffect(() => {
    if (query.trim()) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        handleSearch(query);
      }, 400);
    } else {
      setResults([]);
      setShowDropdown(false);
    }

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="manga-search-bar-wrapper" ref={dropdownRef}>
      <input
        type="text"
        className="manga-search-input"
        placeholder="Search manga..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setShowDropdown(true);
        }}
      />
      {showDropdown && (
        <div className="manga-search-dropdown">
          {isLoading ? (
            <div className="manga-search-loading">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((manga) => (
                <div
                  key={manga.id}
                  className="manga-search-result-item"
                  onClick={() => handleResultClick(manga.id)}
                >
                  <img
                    src={manga.coverImage.medium}
                    alt={manga.title.romaji}
                  />
                  <div className="manga-info">
                    <strong>{manga.title.english || manga.title.romaji}</strong>
                    <small>{manga.format} • {manga.chapters ?? "?"} ch</small>
                  </div>
                </div>
              ))}
              <div className="manga-view-all" onClick={handleViewAll}>
                View all results →
              </div>
            </>
          ) : (
            <div className="manga-search-loading">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MangaSearchBar;
