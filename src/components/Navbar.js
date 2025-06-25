import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Navbar.css";
import logo from "../assets/logo icon.png";
import SearchBar from "../components/navbar components/SearchBar.js";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      
        <img src={logo} alt="AniVerse" className="logo"></img>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/">Watchlist</Link></li>
          <li><Link to="/manga">Manga</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
       <SearchBar />
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;
