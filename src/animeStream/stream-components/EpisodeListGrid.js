// stream-components/EpisodeListGrid.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../stream-styles/EpisodeList.css';

const EpisodeListGrid = ({ episodes }) => {
  const { animeId } = useParams();

  return (
    <div className="episode-grid">
      {episodes.map((ep) => (
        <Link
          to={`/watch/${animeId}/episode/${ep.id}`}
          className="episode-card"
          key={ep.id}
        >
          <img src={ep.thumbnail} alt={`Episode ${ep.number}`} />
          <div className="episode-overlay">
            {ep.isNew && <span className="new-tag">NEW</span>}
            <span className="duration">{ep.duration}</span>
            <span className="ep-number">{ep.number}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EpisodeListGrid;
