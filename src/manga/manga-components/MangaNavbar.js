import React from "react";
import "../manga-styles/MangaNavbar.css";
import MangaSearchBar from "./MangaSearchBar";

const MangaNavbar = () => {
  return (
    <div className="manga-navbar">
      <h1 className="manga-title">
        AniVerse <span>MANGA</span>
      </h1>

      <MangaSearchBar />
    </div>
  );
};

export default MangaNavbar;

