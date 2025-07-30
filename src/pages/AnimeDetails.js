import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";
import banner5 from "../assets/banner5.png";
import banner6 from "../assets/banner6.png";
import banner7 from "../assets/banner7.png";
import banner8 from "../assets/banner8.png";
import "../styles/AnimeDetails.css";
import { Link } from "react-router-dom";
import loadingGif from "../assets/rikka-takanashi.gif";
import axios from "axios";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const banners = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8];
  const randomBanner = banners[Math.floor(Math.random() * banners.length)];

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            description(asHtml: false)
            format
            status
            episodes
            duration
            season
            seasonYear
            averageScore
            genres
            startDate {
              month
              day
              year
            }
            endDate {
              month
              day
              year
            }
            studios {
              nodes {
                name
              }
            }
            characters(role: MAIN, perPage: 10) {
              edges {
                node {
                  name {
                    full
                  }
                  image {
                    large
                  }
                }
                voiceActors(language: JAPANESE) {
                  name {
                    full
                  }
                  image {
                    large
                  }
                }
              }
            }
            trailer {
              id
              site
            }
            relations {
              edges {
                relationType
                node {
                  id
                  title {
                    romaji
                    english
                  }
                }
              }
            }
          }
        }
      `;

      const variables = { id: Number(id) };

      try {
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });

        const json = await res.json();
        setAnime(json?.data?.Media);
      } catch (err) {
        console.error("Failed to fetch anime details:", err);
      }
    };

    fetchAnimeDetails();
  }, [id]);


  // ========Handle Watch List=========
  const [inWatchlist, setInWatchlist] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/watchlist/${userId}`);
        const exists = data.some((item) => item.itemId === anime?.id.toString());
        setInWatchlist(exists);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    if (anime && userId) {
      fetchWatchlist();
    }
  }, [anime, userId]);

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
        id: anime.id.toString(),
        title: anime.title.english || anime.title.romaji || "Untitled",
        image: anime.coverImage?.large || "",
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/watchlist/add",
        {
          userId,
          item,
          type: "anime",
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
          itemId: anime.id.toString(),
          type: "anime",
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


  // const toggleWatchlist = async () => {
  //   if (inWatchlist) {
  //     await handleRemoveFromWatchlist();
  //   } else {
  //     await handleAddToWatchlist();
  //   }
  // };



  if (!anime) return <div className="loading-container">
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
    <p>Loading Please Wait...</p>
  </div>;



  return (
    <div className="anime-details-container">
      <img src={randomBanner} alt="banner" className="banner1" />
      <div className="anime-details">
        <div className="anime-main">

          <div className="anime-cover">
            <img src={anime.coverImage.large} alt="cover" />
          </div>

          <div className="anime-info">
            <h1>{anime.title.english || anime.title.romaji}</h1>
            <div className="anime-tags">
              <span>📺 {anime.format}</span>
              <span>🎯 {anime.status}</span>
              <span>⏳ {anime.duration} min</span>
              <span>📅 {anime.seasonYear}</span>
              <span>⭐ {anime.averageScore}</span>
            </div>
            <div className="anime-buttons">
              <button className="watch-now">▶ Watch now</button>
              {inWatchlist ? (
                <button
                  className="add-list-remove"
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

            <p className="anime-description" dangerouslySetInnerHTML={{ __html: anime.description }} />
          </div>
        </div>


        <div className="anime-meta">
          <p><strong>Japanese:</strong> {anime.title.romaji}</p>
          <p><strong>Episodes:</strong> {anime.episodes}</p>
          <p><strong>Studios:</strong> {anime.studios.nodes.map((s) => s.name).join(", ")}</p>
          <p><strong>Status:</strong> {anime.status}</p>
          <p><strong>Score:</strong> {anime.averageScore} / 100</p>
          <p><strong>Season:</strong> {anime.season} {anime.seasonYear}</p>
          <p><strong>Start Date: </strong> {anime.startDate.day}/{anime.startDate.month}/{anime.startDate.year}</p>
          <p><strong>End Date: </strong>
            {anime.endDate?.day
              ? `${anime.endDate.day}/${anime.endDate.month}/${anime.endDate.year}`
              : "Ongoing"}
          </p>
          <p><strong>Genres:</strong> {anime.genres.map((g) => (
            <span key={g} className="genre-pill">{g}</span>
          ))}</p>
        </div>

        {anime.trailer?.site === "youtube" && (
          <div className="anime-trailer">
            <div className="trailer-heading">
              <h2 className="trailer">Official Trailer</h2>
            </div>
            <div className="trailer-video">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {anime.relations?.edges?.length > 0 ? (
          <div className="anime-relations">
            <h3>Related Anime</h3>
            <div className="relations-buttons">
              {anime.relations.edges.filter(({ relationType, node }) => relationType !== "ADAPTATION" && node?.id && node?.title).map(({ node, relationType }) => (
                <Link
                  to={`/anime/${node.id}`}
                  key={node.id}
                  className="relation-button"
                >
                  {relationType}: {node.title.english || node.title.romaji}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading related anime...</p>
        )}


        <div className="anime-characters">
          <h3>Characters & Voice Actors</h3>
          <div className="character-grid">
            {anime.characters.edges.map(({ node, voiceActors }, idx) => (
              <div key={idx} className="character-card">
                <img src={node.image.large} alt={node.name.full} className="character-img" />
                <div>
                  <p className="character-name">{node.name.full}</p>
                  {voiceActors[0] && (
                    <div className="voice-actor">
                      <img src={voiceActors[0].image.large} alt={voiceActors[0].name.full} className="va-img" />
                      <span>{voiceActors[0].name.full}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
