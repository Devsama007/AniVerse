import React, { useEffect, useState, useRef } from "react";
import "./../styles/Carousel.css";

function Carousel() {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef();

  useEffect(() => {
    const query = `
      query {
        Page(perPage: 10) {
          media(sort: TRENDING_DESC, type: ANIME) {
            id
            title {
              english
              romaji
            }
            description(asHtml: false)
            coverImage {
              extraLarge
            }
          }
        }
      }
    `;

    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.Page?.media) {
          setFeaturedAnime(result.data.Page.media);
        } else {
          console.error("No data received from AniList");
        }
      })
      .catch((err) => console.error("AniList fetch failed:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === featuredAnime.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredAnime]);

  return (
    <div className="carousel-slider-container">
      <div
        className="carousel-slider-track"
        ref={sliderRef}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredAnime.map((anime) => (
          <div className="carousel-slide-item" key={anime.id}>
            <img
              src={anime.coverImage.extraLarge}
              alt={anime.title.english || anime.title.romaji}
              className="carousel-slide-img"
            />
            <div className="carousel-overlay">
              <h2>{anime.title.english || anime.title.romaji}</h2>
              <p>{anime.description?.substring(0, 160)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;

