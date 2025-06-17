import React from "react";
import "./../styles/Card.css";

function Card({ index, title, image, className = "" }) {
  return (
    <div className={`anime-card ${className}`}>
      <img src={image} alt={title} />
      <p className="anime-title">{title}</p>
      <p className="anime-index">{String(index).padStart(2, '0')}</p>
    </div>
  );
}

export default Card;
