import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AnimeDetails from "./pages/AnimeDetails";
import GenreAnimePage from "./pages/GenreAnimePage";
import SearchResultPage from "./pages/SearchResultPage";
import Movies from "./pages/Movies"

//Manga section
import MangaMainPage from "./manga/MangaMainPage";
import PopularMangaPage from "./manga/PopularMangaPage";
import MangaDetails from "./manga/MangaDetails";
import MangaSearchResult from "./manga/manga-components/MangaSearchResult";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore/:section" element={<Explore />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/genre/:genreName" element={<GenreAnimePage />} />
      <Route path="/search/:searchQuery" element={<SearchResultPage />} />
      <Route path="/movies" element={<Movies />} />

      {/* Manga section */}
      <Route path="/manga" element={<MangaMainPage />} />
      <Route path="/manga/popular" element={<PopularMangaPage />} />
      <Route path="/manga/:id" element={<MangaDetails />}/>
      <Route path="/manga/search/:searchQuery" element={<MangaSearchResult />} />

    </Routes>
      
    
  );
}

export default AppRoutes;

