import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./../styles/Navbar.css";
import logo from "../assets/logo icon.png";
import SearchBar from "../components/navbar components/SearchBar.js";
import LoginModal from "../user/LoginModal";
import UserProfileDropdown from "../user/user-components/UserProfileDropdown";
import dummyAvatar from "../assets/nao-tomori.png";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {
      username: "Guest",
      email: "guest@example.com",
      profilePic: dummyAvatar
    };
  });

  const dropdownRef = useRef();

  useEffect(() => {
    // Function to parse and set user data from storage
    const updateCurrentUserFromStorage = () => {
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : {
        username: "Guest",
        email: "guest@example.com",
        profilePic: dummyAvatar
      });
    };

    // Initial load
    updateCurrentUserFromStorage();

    // 🎯 Listen for the custom 'userUpdated' event from Profile.js (or any other component)
    window.addEventListener("userUpdated", updateCurrentUserFromStorage);

    // Listen for native 'storage' event for cross-tab/window updates
    window.addEventListener('storage', updateCurrentUserFromStorage);

    // Click outside handler for dropdown
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("userUpdated", updateCurrentUserFromStorage); // 🎯 Cleanup custom event listener
      window.removeEventListener('storage', updateCurrentUserFromStorage); // Cleanup native storage event listener
    };
  }, []);

  const handleLoginClick = () => setShowLogin(true);

  const handleCloseModal = (loginSuccess) => {
    setShowLogin(false);
    if (loginSuccess) {
      setIsLoggedIn(true);
      // Ensure user state is updated after successful login
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : {
        username: "Guest",
        email: "guest@example.com",
        profilePic: dummyAvatar
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear the user data
    sessionStorage.removeItem("user"); // Clear the user data

    setIsLoggedIn(false);
    setCurrentUser({ // Reset to guest user
      username: "Guest",
      email: "guest@example.com",
      profilePic: dummyAvatar
    });
    setShowDropdown(false);
  };

  const avatarSrc = currentUser.profilePic?.startsWith("http")
    ? `${currentUser.profilePic}?t=${Date.now()}`
    : dummyAvatar;

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

          {isLoggedIn ? (
            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-icon"
                title="Profile"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="nav-avatar"
                />
              </div>
              {showDropdown && (
                <UserProfileDropdown user={currentUser} onLogout={handleLogout} />
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

