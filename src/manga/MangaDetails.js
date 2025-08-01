import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./manga-styles/MangaDetails.css";
import { Link } from "react-router-dom";
import loadingGif from "../assets/rikka-takanashi.gif";
import errorPng from "../assets/nao-tomori.png";
import axios from "axios";

const MangaDetails = () => {
  const { id, title } = useParams();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `
    query ($search: String, $id: Int) {
      Media(id: $id, search: $search, type: MANGA) {
        id
        title {
          romaji
          english
        }
        description(asHtml: false)
        coverImage {
          large
        }
        bannerImage
        status
        chapters
        volumes
        startDate {
          year
        }
        averageScore
        popularity
        format
        genres
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
              }
              coverImage {
                medium
              }
              type
            }
          }
        }
        characters(perPage: 8, sort: [ROLE, RELEVANCE]) {
          edges {
            node {
              id
              name {
                full
              }
              image {
                medium
              }
            }
          }
        }
      }
    }
  `;

    const fetchData = async () => {
      setLoading(true);
      try {
        const variables = id
          ? { id: parseInt(id) }
          : { search: decodeURIComponent(title) };

        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });

        const json = await res.json();
        setManga(json.data.Media);
      } catch (err) {
        console.error("Error fetching manga details:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, [id, title]);



  // ========Handle Manga List=========
  const [inWatchlist, setInWatchlist] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/watchlist/${userId}`);
        const exists = data.some((item) => item.itemId === manga?.id.toString());
        setInWatchlist(exists);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    if (manga && userId) {
      fetchWatchlist();
    }
  }, [manga, userId]);


  const handleAddToWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id;

      if (!token || !userId) {
        console.error("User not authenticated.");
        alert("Please log in to add to watchlist.");
        return;
      }

      const item = {
        id: manga.id.toString(),
        title: manga.title.english || manga.title.romaji || "Untitled",
        image: manga.coverImage?.large || "",
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/watchlist/add",
        {
          userId,
          item,
          type: "manga",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data.message);
      setInWatchlist(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add to watchlist.");
    }
  };


  const handleRemoveFromWatchlist = async () => {
    try {
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
          itemId: manga.id.toString(),
          type: "manga",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data.message);
      setInWatchlist(false);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      alert("Failed to remove from watchlist.");
    }
  };


  if (loading) return <div className="loading-container">
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
    <p>Loading Please Wait...</p>
  </div>

  // Encoding manga titles
  if (!manga) return <div className="manga-error">
    <img src={errorPng} alt="Manga Not Found..." className="error-png" />
    <p>Manga Not Found</p>
  </div>

  const normalizeTitle = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, " ")
      .trim()
      .replace(/\s+/g, "%20");

  // Usage:
  const encodedTitle = normalizeTitle(manga.title.romaji || manga.title.english);


  return (
    <div className="manga-details">
      {manga.bannerImage && (
        <div
          className="manga-banner"
          style={{ backgroundImage: `url(${manga.bannerImage})` }}
        ></div>
      )}

      <div className="manga-header">
        <div className="manga-cover">
          <img src={manga.coverImage.large} alt={manga.title.romaji} />
        </div>


        <div className="manga-info">
          <h1>{manga.title.english || manga.title.romaji}</h1>
          <div className="manga-buttons">

            <Link to={`/manga/${encodedTitle}/read`}>
              <button className="read-btn">Read Now</button>
            </Link>

            {inWatchlist ? (
              <button
                className="add-list remove"
                onClick={handleRemoveFromWatchlist}
              >
                − Remove from List
              </button>
            ) : (
              <button
                className="add-list"
                onClick={handleAddToWatchlist}
              >
                ＋ Add to List
              </button>
            )}
          </div>
          <p className="manga-description">{manga.description?.replace(/<[^>]+>/g, '')}</p>
        </div>
      </div>

      <div className="manga-meta-box">
        <p><strong>Format:</strong> {manga.format}</p>
        <p><strong>Status:</strong> {manga.status}</p>
        <p><strong>Published:</strong> {manga.startDate.year}</p>
        <p><strong>Chapters:</strong> {manga.chapters || "N/A"}</p>
        <p><strong>Volumes:</strong> {manga.volumes || "N/A"}</p>
        <p><strong>Score:</strong> {manga.averageScore || "N/A"}</p>
        <p><strong>Popularity:</strong> {manga.popularity || "N/A"}</p>
      </div>

      <div className="manga-relations">
        <h2>Relations</h2>
        <div className="manga-relation-grid">
          {manga.relations.edges.map(({ relationType, node }) => (
            <div key={node.id} className="manga-relation-card">
              <img src={node.coverImage.medium} alt={node.title.romaji} />
              <span>{relationType}</span>
              <p>{node.title.romaji}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="manga-characters">
        <h2>Characters</h2>
        <div className="manga-character-grid">
          {manga.characters.edges.map(({ node }) => (
            <div key={node.id} className="manga-character-card">
              <img src={node.image.medium} alt={node.name.full} />
              <p>{node.name.full}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
