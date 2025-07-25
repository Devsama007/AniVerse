import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import "../components/navbar components/SearchResultPage.css";
import { Link } from "react-router-dom"

const SearchResultPage = () => {
  const { searchQuery } = useParams();
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const query = `
        query ($search: String) {
          Page(perPage: 30) {
            media(search: $search, type: ANIME) {
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
      const variables = { search: searchQuery };

      try {
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });

        const json = await res.json();
        setAnimeList(json?.data?.Page?.media || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="search-results-page">
      <h2>
        Search results for: <em>{searchQuery}</em>
      </h2>
      <div className="search-grid">
        {animeList.map((anime, idx) => (
          <Link to={`/anime/${anime.id}`} className="card-link">
            <Card
              index={idx + 1}
              title={anime.title.english || anime.title.romaji}
              image={anime.coverImage.large}
              className="grid-glow"
              id={anime.id} // 🔥 this is essential
              type="anime"
            />
          </Link>
        ))}
      </div>


    </div>
  );
};

export default SearchResultPage;
