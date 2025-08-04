// Frontend/EpisodePlayerPage.jsx
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Hls from 'hls.js';
import '../stream-styles/PlayerPage.css';

const mockEpisodes = {
  'ep-1': { number: 1 },
  'ep-2': { number: 2 },
  'ep-3': { number: 3 },
  'ep-4': { number: 4 },
  'ep-5': { number: 5 },
  'ep-6': { number: 6 },


  // ... etc.
};

const EpisodePlayerPage = () => {
  const { animeId, episodeId } = useParams();
  const videoRef = useRef();

  const streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; // test stream

  useEffect(() => {
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      videoRef.current.play();
    }

    return () => hls?.destroy();
  }, [streamUrl]);

  const episode = mockEpisodes[episodeId];

  return (
    <div className="player-page">
      <h2>Episode {episode?.number}</h2>
      <video ref={videoRef} controls style={{ width: '100%', maxWidth: '960px' }} />
    </div>
  );
};

export default EpisodePlayerPage;



