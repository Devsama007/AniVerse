import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
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
          media(search: $search, type: ANIME) {
            id
            title {
              english
              romaji
            }
            coverImage {
              medium
            }
            format
            duration
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
        (anime) => Array.isArray(anime.genres) && !anime.genres.includes("Hentai")
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
    navigate(`/anime/${id}`);
    setShowDropdown(false);
  };

  const handleViewAll = () => {
    navigate(`/search/${query}`);
    setShowDropdown(false);
  };

  // Debounce input to avoid API spamming
  useEffect(() => {
    if (query.trim()) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        handleSearch(query);
      }, 400); // 400ms debounce
    } else {
      setResults([]);
      setShowDropdown(false);
    }

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  // Close dropdown on outside click
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
    <div className="search-bar-wrapper" ref={dropdownRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setShowDropdown(true);
        }}
      />
      {showDropdown && (
        <div className="search-dropdown">
          {isLoading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((anime) => (
                <div
                  key={anime.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(anime.id)}
                >
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} />
                  <div className="info">
                    <strong>{anime.title.english || anime.title.romaji}</strong>
                    <small>{anime.format} • {anime.duration}m</small>
                  </div>
                </div>
              ))}
              <div className="view-all" onClick={handleViewAll}>
                View all results →
              </div>
            </>
          ) : (
            <div className="search-loading">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;



