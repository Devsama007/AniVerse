//src/animeStream/Frontend/AnimePage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EpisodeListGrid from '../stream-components/EpisodeListGrid';
import { searchAnimeByTitle, getEpisodesByAnimePaheId } from '../stream-services/animepaheAPI';
import '../stream-styles/AnimePage.css';
import { getAnilistTitleById } from '../stream-services/anilistAPI';

const AnimePage = () => {
  const { animeId } = useParams();
  const [episodes, setEpisodes] = useState([]);

useEffect(() => {
  const fetchEpisodes = async () => {
    try {
      const anilistId = decodeURIComponent(animeId); // Still numeric, e.g., 16498
      const animeTitle = await getAnilistTitleById(anilistId); // 🔁 Resolve to title

      if (!animeTitle) throw new Error("❌ Could not resolve anime title from Anilist");

      const animePaheId = await searchAnimeByTitle(animeTitle); // ✅ Now valid title string

      if (!animePaheId) throw new Error("No matching anime on AnimePahe");

      const episodes = await getEpisodesByAnimePaheId(animePaheId);
      console.log("✅ Episodes:", episodes);

      const formatted = episodes.map((ep) => ({
        id: ep.session,
        number: ep.episode,
        duration: ep.duration,
        thumbnail: ep.snapshot,
        isNew: false,
      }));

      setEpisodes(formatted);
    } catch (err) {
      console.error("❌ Error fetching episodes:", err.message);
    }
  };

  if (animeId) fetchEpisodes();
}, [animeId]);



  return (
    <div className="anime-page">
      <div className="episodes-header">
        <h2>Episodes ({episodes.length})</h2>
      </div>

      <EpisodeListGrid episodes={episodes} />
    </div>
  );
};

export default AnimePage;

