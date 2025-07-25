import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import "./manga-styles/PopularMangaPage.css";
import loadingGif from "../assets/rikka-takanashi.gif";

const POPULAR_MANGA_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

const PopularMangaPage = () => {
  const [mangaList, setMangaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (page) => {
    setIsLoading(true);
    const variables = { page, perPage: 35 };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: POPULAR_MANGA_QUERY, variables }),
      });

      const json = await res.json();
      const media = json?.data?.Page?.media || [];
      setMangaList(media);
    } catch (err) {
      console.error("Error fetching manga:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  return (
    <div className="popular-manga-page">
      <h2 className="popular-manga-title">Popular Manga</h2>

      {isLoading ? (
        <div className="loading-container">
          <img src={loadingGif} alt="Loading..." className="loading-gif" />
          <p>Loading Please Wait...</p>
        </div>
      ) : (
        <>
          <div className="popular-manga-grid">
            {mangaList.map((manga, idx) => (
              <Link key={manga.id} to={`/manga/${manga.id}`} className="card-link">
                <Card
                  index={(currentPage - 1) * 35 + idx + 1}
                  title={manga.title.english || manga.title.romaji || "Untitled"}
                  image={manga.coverImage.large}
                  className="manga-card"
                  id={manga.id} // 🔥 this is essential
                  type="manga"
                />
              </Link>
            ))}
          </div>

          {/* Pagination */}
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

export default PopularMangaPage;