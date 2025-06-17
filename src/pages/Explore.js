import React, { useEffect, useState, useCallback } from "react";
import Card from "../components/Card";
import "../styles/Explore.css";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"

// Constants
const sectionHeadings = {
  "top-airing": "Top Airing",
  "most-popular": "Most Popular",
  "most-favorited": "Most Favorited",
  "latest-completed": "Latest Completed",
};

const sortOptions = {
  "top-airing": "POPULARITY_DESC",
  "most-popular": "POPULARITY_DESC",
  "most-favorited": "FAVOURITES_DESC",
  "latest-completed": "END_DATE_DESC",
};

const statusOptions = {
  "top-airing": "RELEASING",
  "latest-completed": "FINISHED",
};

const GET_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus) {
    Page(page: $page, perPage: $perPage) {
      media(sort: $sort, status: $status, type: ANIME) {
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

const Explore = () => {
  const { section } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async (page) => {
    setIsLoading(true);

    const sort = sortOptions[section];
    const status = statusOptions[section];

    const variables = {
      page,
      perPage: 35,
      sort,
      ...(status && { status }),
    };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: GET_QUERY, variables }),
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
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [section]);

  useEffect(() => {
    setCurrentPage(1); // Reset page on section change
  }, [section]);

  useEffect(() => {
    fetchData(currentPage);
  }, [section, currentPage, fetchData]);

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h2 className="explore-title">
          {sectionHeadings[section] || "Explore Anime"}
        </h2>
        <button className="back-home" onClick={() => navigate("/")}>
          ← Return to Home
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          <div className="explore-grid">
            {animeList.map((anime, idx) => (

            <Link to={`/anime/${anime.id}`} className="card-link">
              <Card
                key={anime.id || idx}
                index={(currentPage - 1) * 35 + idx + 1}
                title={anime.title.english || anime.title.romaji}
                image={anime.coverImage.large}
                className="explore-glow"
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

export default Explore;
