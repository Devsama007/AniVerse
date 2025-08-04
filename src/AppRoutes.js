import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AnimeDetails from "./pages/AnimeDetails";
import GenreAnimePage from "./pages/GenreAnimePage";
import SearchResultPage from "./pages/SearchResultPage";
import Movies from "./pages/Movies";
import WatchList from "./pages/WatchList";

//Manga section
import MangaMainPage from "./manga/MangaMainPage";
import PopularMangaPage from "./manga/PopularMangaPage";
import MangaDetails from "./manga/MangaDetails";
import MangaSearchResult from "./manga/manga-components/MangaSearchResult";
import MangaReaderPage from "./manga/MangaReaderPage";
import MangaView from "./manga/MangaView";
//import MangaRedirect from "./manga/manga-components/MangaRedirect";

import Profile from "./user/user-components/Profile";

//Anime Stream
import AnimePage from './animeStream/Frontend/AnimePage';
import EpisodePlayerPage from './animeStream/Frontend/EpisodePlayerPage';




function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore/:section" element={<Explore />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/genre/:genreName" element={<GenreAnimePage />} />
      <Route path="/search/:searchQuery" element={<SearchResultPage />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/watchlist" element={<WatchList />} />

      {/* Manga section */}
      <Route path="/manga" element={<MangaMainPage />} />
      <Route path="/manga/popular" element={<PopularMangaPage />} />
      <Route path="/manga/:id" element={<MangaDetails />} />
      <Route path="/manga/search/:searchQuery" element={<MangaSearchResult />} />
      <Route path="/manga/:mangaTitle/read" element={<MangaReaderPage />} />
      <Route path="/manga/:mangaTitle/read/:chapterHid" element={<MangaView />} />
      {/*<Route path="/manga/search/:title" element={<MangaRedirect />} /> */}
      <Route path="/manga/title/:title" element={<MangaDetails />} />

      {/* User Profile */}
      <Route path="/profile" element={<Profile />} />

      {/* Anime Stream */}
      <Route path="/watch/:animeId" element={<AnimePage />} />
      <Route path="/watch/:animeId/episode/:episodeId" element={<EpisodePlayerPage />} />

    </Routes>


  );
}

export default AppRoutes;

