import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./../styles/Navbar.css";
import logo from "../assets/logo icon.png";
import SearchBar from "../components/navbar components/SearchBar.js";
import LoginModal from "../user/LoginModal";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();

  // 🟢 Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginClick = () => setShowLogin(true);

  const handleCloseModal = (loginSuccess) => {
    setShowLogin(false);
    if (loginSuccess) {
      setIsLoggedIn(true); // ✅ only set this when login was actually successful
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="AniVerse" className="logo" />
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/">Watchlist</Link></li>
            <li><Link to="/manga">Manga</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <SearchBar />

          {isLoggedIn ? (
            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-icon"
                title="Profile"
                onClick={() => setShowDropdown((prev) => !prev)}
              ></div>
              {showDropdown && (
                <div className="user-dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={handleLoginClick}>Login</button>
          )}
        </div>
      </nav>

      {/* 🔓 Login Modal */}
      {showLogin && <LoginModal onClose={handleCloseModal} />}
    </>
  );
};

export default Navbar;

