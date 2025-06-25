import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/Card";
import "../manga-styles/MangaSearchResult.css";

const MangaSearchResult = () => {
  const { searchQuery } = useParams();
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const query = `
        query ($search: String) {
          Page(perPage: 30) {
            media(search: $search, type: MANGA, sort: POPULARITY_DESC) {
              id
              title {
                english
                romaji
              }
              coverImage {
                large
              }
              format
            }
          }
        }
      `;

      const variables = { search: searchQuery };

      try {
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });

        const json = await res.json();
        setMangaList(json?.data?.Page?.media || []);
      } catch (err) {
        console.error("Error fetching manga search results:", err);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="manga-search-results-page">
      <h2>
        Search results for: <em>{searchQuery}</em>
      </h2>

      <div className="manga-search-grid">
        {mangaList.length > 0 ? (
          mangaList.map((manga, idx) => (
            <Link to={`/manga/${manga.id}`} key={manga.id} className="card-link">
              <Card
                index={idx + 1}
                title={manga.title.english || manga.title.romaji}
                image={manga.coverImage.large}
                className="grid-glow"
              />
            </Link>
          ))
        ) : (
          <p className="no-results-text">No results found for "{searchQuery}".</p>
        )}
      </div>
    </div>
  );
};

export default MangaSearchResult;
