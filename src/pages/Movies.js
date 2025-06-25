import React, { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import "../components/navbar components/Movies.css";
import { Link } from "react-router-dom"

const MOVIES_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        format
        duration
      }
    }
  }
`;

const Movies = () => {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (page) => {
    setIsLoading(true);
    const variables = { page, perPage: 35 };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: MOVIES_QUERY, variables }),
      });

      const json = await res.json();
      const media = json?.data?.Page?.media || [];
      setAnimeList(media);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  return (
    <div className="movies-page">
      <h2 className="movies-title">Anime Movies</h2>

      {isLoading ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <>
          <div className="movies-grid">
            {animeList.map((anime, idx) => (
            <Link to={`/anime/${anime.id}`} className="card-link">
              <Card
                key={anime.id || idx}
                index={(currentPage - 1) * 35 + idx + 1}
                title={anime.title.english || anime.title.romaji}
                image={anime.coverImage.large}
                className="movies-glow"
              />
            </Link>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹ Previous
            </button>

            <span className="page-number">Page {currentPage}</span>

            <button onClick={() => setCurrentPage((prev) => prev + 1)}>
              Next ›
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Movies;
