import React, { useState, useEffect, useRef } from "react";
import "./../styles/GenreTabs.css";
import { useNavigate } from "react-router-dom";

// You can expand this genre list as needed
const genresList = [
  { id: "Action", name: "Action" },
  { id: "Adventure", name: "Adventure" },
  { id: "Cars", name: "Cars" },
  { id: "Comedy", name: "Comedy" },
  { id: "Dementia", name: "Dementia" },
  { id: "Demons", name: "Demons" },
  { id: "Drama" , name: "Drama" },
  { id: "Ecchi", name: "Ecchi" },
  { id: "Fantasy", name: "Fantasy" },
  { id: "Game", name: "Game" },
  { id: "Harem", name: "Harem" },
  { id: "Historical", name: "Historical" },
  { id: "Horror", name: "Horror" },
  { id: "Isekai", name: "Isekai" },
  { id: "Josei", name: "Josei" },
  { id: "Kids", name: "Kids" },
  { id: "Magic", name: "Magic" },
  { id: "Martial Arts", name: "Martial Arts" },
  { id: "Mecha", name: "Mecha" },
  { id: "Military", name: "Military" },
  { id: "Music", name: "Music" },
  { id: "Mystery", name: "Mystery" },
  { id: "Parody", name: "Parody" },
  { id: "Police", name: "Police" },
  { id: "Psychological", name: "Psychological" },
  { id: "Romance", name: "Romance" },
  { id: "Samurai", name: "Samurai" },
  { id: "School", name: "School" },
  { id: "Sci-Fi", name: "Sci-Fi" },
  { id: "Seinen", name: "Seinen" },
  { id: "Shoujo", name: "Shoujo" },
  { id: "Shounen", name: "Shounen" },
  { id: "Slice of Life", name: "Slice of Life" },
  { id: "Space", name: "Space" },
  { id: "Sports", name: "Sports" },
  { id: "Super Power", name: "Super Power" },
  { id: "Supernatural", name: "Supernatural" },
  { id: "Thriller", name: "Thriller" },
  { id: "Vampire", name: "Vampire" },
];

function GenreTabs({ onGenreSelect }) {
  const [activeGenre, setActiveGenre] = useState(genresList[0]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof onGenreSelect === "function") {
      console.log("Selected Genre:", activeGenre.id);
      onGenreSelect(activeGenre.id);
    }
  }, [activeGenre, onGenreSelect]);

const scroll = (direction) => {
  const amount = 150;
  if (containerRef.current) {
    containerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }
};


  return (
<div className="genre-tabs-wrapper-container">
  <div className="genre-scroll-buttons">
    <button className="genre-scroll-button" onClick={() => scroll("left")}>‹</button>
    <button className="genre-scroll-button" onClick={() => scroll("right")}>›</button>
  </div>

  <div className="genre-tabs-wrapper" ref={containerRef}>
    <div className="genre-tabs-container">
      {genresList.map((genre) => (
        <button
    key={genre.id}
    className={`genre-tab ${genre.name === activeGenre ? "active" : ""}`}
    onClick={() => {
      setActiveGenre(genre.name);
      navigate(`/genre/${genre.name}`);
    }}
  >
    {genre.name}
  </button>
      ))}
    </div>
  </div>
  
</div>


  );
}

export default GenreTabs;


