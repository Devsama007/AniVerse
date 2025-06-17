import React from "react";
import Carousel from "../components/Carousel";
import GenreTabs from "../components/GenreTabs";
import TrendingSection from "../components/TrendingSection";
import AnimeGrid from "../components/AnimeGrid";

function Home() {
  return (
    <div className="home-container">
      <Carousel />
      <GenreTabs />
      <TrendingSection />
      <AnimeGrid />
      {/* GenreTabs, AnimeGrid will follow here */}
    </div>
  );
}

export default Home;

