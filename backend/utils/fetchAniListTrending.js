// backend/utils/fetchAniListTrending.js
const axios = require("axios");

const fetchTrendingFromAniList = async (type = "ANIME") => {
  const query = `
    query ($type: MediaType) {
      Page(perPage: 5) {
        media(type: $type, sort: TRENDING_DESC) {
          title {
            romaji
            english
          }
          description(asHtml: false)
          siteUrl
        }
      }
    }
  `;

  const variables = { type };

  const response = await axios.post("https://graphql.anilist.co", {
    query,
    variables,
  });

  return response.data.data.Page.media.map((item) => ({
    title: item.title.english || item.title.romaji,
    description: item.description
      ? item.description.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
      : "No description available.",
    url: item.siteUrl,
  }));
};

module.exports = fetchTrendingFromAniList;
