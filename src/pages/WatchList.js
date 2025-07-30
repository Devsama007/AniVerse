import React, { useEffect, useState } from "react";
import "../components/navbar components/WatchList.css";
import axios from "axios";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const WatchList = () => {
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;


  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const [animeRes, mangaRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/watchlist/${userId}/anime`),
          axios.get(`http://localhost:5000/api/user/watchlist/${userId}/manga`)
        ]);

        // console.log("Anime Watchlist Response:", animeRes.data);
        // console.log("Manga Watchlist Response:", mangaRes.data);

        setAnimeList(animeRes.data.watchlist || []);
        setMangaList(mangaRes.data.watchlist || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchWatchlist();
    } else {
      console.warn("No userId found. Please log in.");
      setLoading(false);
    }
  }, [userId]);


  // Watchlist Card remove 
  const [removingId, setRemovingId] = useState(null);

  const handleRemoveFromWatchlist = async (itemId, type) => {
    try {
      setRemovingId(itemId); // Trigger animation

      setTimeout(async () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id;

        if (!token || !userId) {
          console.error("User not authenticated.");
          alert("Please log in to remove from watchlist.");
          return;
        }

        const { data } = await axios.post(
          "http://localhost:5000/api/user/remove-from-watchlist",
          {
            userId,
            itemId,
            type,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(data.message);

        // Update list on UI
        if (type === "anime") {
          setAnimeList((prev) => prev.filter((item) => item.id !== itemId));
        } else {
          setMangaList((prev) => prev.filter((item) => item.id !== itemId));
        }

        setRemovingId(null);
        setDropdownVisibleId(null);
      }, 500);

      // setDropdownVisibleId(null); // Hide dropdown if needed
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      alert("Failed to remove from watchlist.");
    }
  };




  // Toggle button 
  const [dropdownVisibleId, setDropdownVisibleId] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownVisibleId((prevId) => (prevId === id ? null : id));
  };


  if (loading) {
    return <div className="watchlist-container">Loading watchlist...</div>;
  }

  return (
    <div className="watchlist-container">
      <h2 className="section-heading">🎬 Anime Watchlist</h2>
      <div className="anime-list">
        {animeList.length > 0 ? (
          animeList.map((anime, idx) => (
            <div className="card-wrapper" style={{ position: "relative" }} key={anime._id}>
              {/* 3-dot dropdown menu */}
              <div className="dropdown-menu-wrapper">
                <button
                  className="menu-button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    toggleDropdown(anime._id);
                  }}
                >
                  ⋮
                </button>

                {dropdownVisibleId === anime._id && (
                  <div className="dropdown-content">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        handleRemoveFromWatchlist(anime.id, "anime");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Card with Link */}
              <div
                key={anime.id}
                className={`watchlist-card ${removingId === anime.id ? 'slide-out' : ''}`}
              >
                {/* Card with Link */}
                <Link to={`/anime/${anime.id}`} className="card-link">
                  <Card
                    index={idx + 1}
                    title={anime.title}
                    image={anime.cover}
                    id={anime.id}
                    type="anime"
                  />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">No anime in watchlist.</p>
        )}
      </div>


      <h2 className="section-heading">📚 Manga Watchlist</h2>
      <div className="manga-list">
        {mangaList.length > 0 ? (
          mangaList.map((manga, idx) => (
            <Link to={`/manga/${manga.id}`} className="card-link" key={manga._id}>
              <Card
                index={idx + 1}
                title={manga.title}
                image={manga.cover}
                id={manga.id}
                type="manga"
              />
            </Link>
          ))
        ) : (
          <p className="empty-message">No manga in watchlist.</p>
        )}
      </div>
    </div>
  );
};

export default WatchList;


