import React from "react";
import { useParams } from "react-router-dom";
import GenreTabsAnimeList from "../components/GenreTabsAnimeList";
import "../styles/GenreAnimePage.css";

const GenreAnimePage = () => {
  const { genreName } = useParams();

  // Convert slug to actual genre (e.g., "Slice-of-Life" => "Slice of Life")
  const formattedGenre = genreName.replace(/-/g, " ");

  return (
    <div className="genre-page">
      <h2 className="genre-title">Genre: {formattedGenre}</h2>
      <GenreTabsAnimeList selectedGenre={formattedGenre} />
    </div>
  );
};

export default GenreAnimePage;
