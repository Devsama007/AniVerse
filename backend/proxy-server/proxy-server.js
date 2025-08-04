const express = require('express');
const fetch = require('node-fetch'); // v2 only
const router = express.Router();

const BASE_URL = 'https://animepahe.ru/api';
const REFERER = 'https://animepahe.ru/';

router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Missing title' });

  try {
    const response = await fetch(`${BASE_URL}?m=search&q=${encodeURIComponent(title)}`, {
      headers: {
        Referer: REFERER,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      console.error(`🔴 AnimePahe responded with status: ${response.status}`);
      return res.status(502).json({ error: 'AnimePahe fetch failed' });
    }

    const data = await response.json();

    const filtered = data.data.map(anime => ({
      title: anime.title,
      animeId: anime.id,
      type: anime.type,
      year: anime.year,
      poster: anime.poster
    }));

    res.json(filtered);
  } catch (err) {
    console.error('❌ Search failed:', err);
    res.status(500).json({ error: 'Internal search error' });
  }
});

module.exports = router;

