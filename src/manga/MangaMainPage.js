import React from "react";
import MangaNavbar from "./manga-components/MangaNavbar";
import MangaGrid from "./manga-components/MangaGrid";
import "./manga-styles/MangaMainPage.css";

const MangaMainPage = () => {
    return (
        <div className="manga-main-page">
            <MangaNavbar />
            <MangaGrid />
        </div>
    );
};

export default MangaMainPage;