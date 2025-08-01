import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./../styles/Navbar.css";
import logo from "../assets/logo icon.png";
import SearchBar from "../components/navbar components/SearchBar.js";
import LoginModal from "../user/LoginModal";
import UserProfileDropdown from "../user/user-components/UserProfileDropdown";
import dummyAvatar from "../assets/nao-tomori.png";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null); // Optional: to avoid closing on avatar click

  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseModal = () => setShowLogin(false);
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const avatarSrc = user?.profilePic?.startsWith("http")
    ? `${user.profilePic}?t=${Date.now()}`
    : dummyAvatar;

  // ⛔ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="AniVerse" className="logo" />
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/watchlist">Watchlist</Link></li>
            <li><Link to="/manga">Manga</Link></li>
          </ul>
        </div>

        <div className="navbar-right">
          <SearchBar />
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-icon"
                title="Profile"
                ref={avatarRef}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <img src={avatarSrc} alt="Avatar" className="nav-avatar" />
              </div>
              {showDropdown && (
                <UserProfileDropdown user={user} onLogout={handleLogout} />
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={handleLoginClick}>Login</button>
          )}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={handleCloseModal} />}
    </>
  );
};

export default Navbar;



