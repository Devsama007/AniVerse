import React from "react";
import "./../styles/Card.css";
import axios from "axios";

function Card({ index, title, image, className = "", id, type = "" }) {
  const handleCardClick = async () => {
    console.log("Card clicked — sending history request", { type, id, title });
    const token = localStorage.getItem("token");
    if (!token || !type || !id) return;

    try {
      await axios.post(
        "http://localhost:5000/api/user/history", // ✅ Full URL instead of proxy
        {
          type, // "anime" or "manga"
          item: {
            id,
            title,
            image,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("❌ Failed to send history request:", error.response?.data || error.message);
    }
  };


  return (
    <div className={`anime-card ${className}`} onClick={handleCardClick}>
      <img src={image} alt={title} />
      <p className="anime-title">{title}</p>
      <p className="anime-index">{String(index).padStart(2, "0")}</p>
    </div>
  );
}

export default Card;

