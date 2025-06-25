import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import "../manga-styles/MangaGrid.css";
import { Link } from "react-router-dom";

const ANILIST_API = "https://graphql.anilist.co";

// Reusable query generator
const getMangaQuery = (sortType, isAdapted = false) => {
    if (isAdapted) {
        return `
      query {
        Page(perPage: 50) {
          media(type: MANGA, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            relations {
              nodes {
                type
              }
            }
          }
        }
      }
    `;
    }

    return `
    query {
      Page(perPage: 30) {
        media(type: MANGA, sort: ${sortType}) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;
};


const sections = [
    { title: "Most Recent Popular", sort: "POPULARITY_DESC", adapted: false },
    { title: "Most Followed New Comics", sort: "TRENDING_DESC", adapted: false },
    { title: "Adapted to Anime", sort: "POPULARITY_DESC", adapted: true },
];


function MangaGrid() {
    const [mangaData, setMangaData] = useState([[], [], []]);
    const scrollRefs = [useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const allData = [];

                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    const res = await fetch(ANILIST_API, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            query: getMangaQuery(section.sort, section.adapted),
                        }),
                    });

                    if (!res.ok) {
                        throw new Error(`Failed to fetch section ${section.title}`);
                    }

                    const json = await res.json();
                    let media = json.data?.Page?.media || [];

                    if (section.adapted) {
                        media = media
                            .filter((manga) =>
                                manga.relations?.nodes?.some((rel) => rel.type === "ANIME")
                            )
                            .slice(0, 30);
                    }

                    allData[i] = media;
                }

                setMangaData(allData);
            } catch (error) {
                console.error("⚠️ Error loading manga sections:", error.message);
            }
        };

        fetchAll();
    }, []);


    const scroll = (index, direction) => {
        const { current } = scrollRefs[index];
        if (direction === "left") current.scrollLeft -= 300;
        else current.scrollLeft += 300;
    };

    return (
        <div className="manga-grid-container">
            {sections.map((section, idx) => (
                <div key={idx} className="manga-section">
                    <h3 className="manga-section-title">{section.title}</h3>

                    <div className="manga-scroll-buttons">
                        <button onClick={() => scroll(idx, "right")} className="scroll-btn">›</button>
                        <button onClick={() => scroll(idx, "left")} className="scroll-btn">‹</button>
                    </div>

                    <div className="manga-scroll-grid" ref={scrollRefs[idx]}>
                        {mangaData[idx].map((manga, i) => (
                            <Link key={manga.id} to={`/manga/${manga.id}`} className="card-link">
                                <Card
                                    index={i + 1}
                                    title={manga.title.english || manga.title.romaji || "Untitled"}
                                    image={manga.coverImage.large}
                                    className="manga-grid-card"
                                />
                            </Link>
                        ))}

                    </div>
                </div>
            ))}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Link to="/manga/popular">
                    <button className="explore-more-btn">Explore More Mangas</button>
                </Link>
            </div>
        </div>
    );
}

export default MangaGrid;
