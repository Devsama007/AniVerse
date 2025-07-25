import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import "./../styles/TrendingSection.css";
import { Link } from "react-router-dom";

const ANILIST_API = "https://graphql.anilist.co";

const TRENDING_QUERY = `
  query {
    Page(perPage: 10) {
      media(sort: TRENDING_DESC, type: ANIME) {
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



function TrendingSection() {
  const [trending, setTrending] = useState([]);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollLeft -= 300;
    } else {
      current.scrollLeft += 300;
    }
  };

  useEffect(() => {
    fetch(ANILIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: TRENDING_QUERY }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTrending(data.data.Page.media);
      });
  }, []);

  return (
    <section className="trending-container">
      <h2 className="trending-title">Trending</h2>

      <div className="scroll-buttons">

        <button onClick={() => scroll("right")} className="scroll-btn">›</button>
        <button onClick={() => scroll("left")} className="scroll-btn">‹</button>

      </div>

      <div className="trending-grid" ref={scrollRef}>
        {trending.map((anime, idx) => (

          <Link to={`/anime/${anime.id}`} className="card-link">
            <Card
              key={anime.id}
              index={idx + 1}
              title={anime.title.english || anime.title.romaji}
              image={anime.coverImage.large}
              className="trending-card"
              id={anime.id} // 🔥 this is essential
              type="anime"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TrendingSection;
