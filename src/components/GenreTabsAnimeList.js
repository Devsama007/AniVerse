import React, { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";


const GENRE_QUERY = `
  query ($genre: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(genre_in: [$genre], type: ANIME) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        genres
      }
    }
  }
`;

const GenreTabsAnimeList = ({ selectedGenre }) => {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (page) => {
    setIsLoading(true);

    const variables = {
      genre: selectedGenre,
      page,
      perPage: 35,
    };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: GENRE_QUERY, variables }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const json = await res.json();

      const filteredMedia = (json?.data?.Page?.media || []).filter(
        (anime) => Array.isArray(anime.genres) && !anime.genres.includes("Hentai")
      );

      setAnimeList(filteredMedia);
    } catch (err) {
      console.error("Error fetching genre animes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    setCurrentPage(1); // Reset page on genre change
  }, [selectedGenre]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, selectedGenre, fetchData]);

  return (
    <div className="genre-anime-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="genre-grid">
            {animeList.map((anime, idx) => (

              <Link to={`/anime/${anime.id}`} className="card-link">
                <Card
                  key={anime.id || idx}
                  index={(currentPage - 1) * 35 + idx + 1}
                  title={anime.title.english || anime.title.romaji}
                  image={anime.coverImage.large}
                  className="genre-glow"
                  id={anime.id} // 🔥 this is essential
                  type="anime"
                />
              </Link>

            ))}
          </div>

          {/* Pagination Controls */}
          <div className="genre-pagination">
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

export default GenreTabsAnimeList;
