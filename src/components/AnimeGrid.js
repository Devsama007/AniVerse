import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <-- Import Link
import Card from "./Card";
import "../styles/AnimeGrid.css";


const GRID_SECTIONS = [
  {
    title: "Top Airing",
    sort: "POPULARITY_DESC",
    filter: { status: "RELEASING" },
    path: "top-airing",
  },
  {
    title: "Most Popular",
    sort: "POPULARITY_DESC",
    filter: {},
    path: "most-popular",
  },
  {
    title: "Most Favorited",
    sort: "FAVOURITES_DESC",
    filter: {},
    path: "most-favorited",
  },
  {
    title: "Latest Completed",
    sort: "END_DATE_DESC",
    filter: { status: "FINISHED" },
    path: "latest-completed",
  },
];


const AnimeGrid = () => {
  const [gridData, setGridData] = useState({});

  const fetchGridSection = async (section) => {
    const query = `
  query ($sort: [MediaSort], $status: MediaStatus) {
    Page(perPage: 5) {
      media(sort: $sort, status: $status, type: ANIME) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        episodes
        popularity
        favourites
        format
      }
    }
  }
`;

    const variables = {
      sort: section.sort,
      ...(section.filter.status && { status: section.filter.status }),
    };

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();

      return json?.data?.Page?.media || [];
    } catch (err) {
      console.error("Error fetching section:", err);
      return [];
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      const data = {};
      for (const section of GRID_SECTIONS) {
        const animeList = await fetchGridSection(section);
        data[section.title] = animeList;
      }
      setGridData(data);
    };

    initFetch();
  }, []);

  return (
    <div className="anime-grid">
      {GRID_SECTIONS.map((section) => (
        <div key={section.title} className="grid-section">
          <h3 className="section-title">{section.title}</h3>
          <div className="card-column">
            {gridData[section.title]?.map((anime, idx) => (
              <div key={anime.id + section.title} className="card-with-meta">

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

                <div className="meta-info">
                  <span className="meta-tag green">📺 {anime.episodes ?? "?"}</span>
                  <span className="meta-tag pink">❤️ {anime.favourites ?? "?"}</span>
                  <span className="meta-tag grey">🔥 {anime.popularity ?? "?"}</span>
                  <span className="meta-tag format">{anime.format ?? "?"}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="view-more-container">
            <Link to={`/explore/${section.path}`} className="view-more">
              View more →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

};

export default AnimeGrid;
