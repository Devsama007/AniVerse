export const getAnilistTitleById = async (anilistId) => {
  const query = `
    query {
      Media(id: ${anilistId}, type: ANIME) {
        title {
          romaji
          english
        }
      }
    }
  `;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data?.Media?.title?.english || json.data?.Media?.title?.romaji;
};
