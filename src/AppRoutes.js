import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AnimeDetails from "./pages/AnimeDetails";
import GenreAnimePage from "./pages/GenreAnimePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore/:section" element={<Explore />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/genre/:genreName" element={<GenreAnimePage />} />
    </Routes>
    
  );
}

export default AppRoutes;

