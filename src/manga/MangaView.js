// manga/MangaView.js
import React, { useEffect, useState } from "react";
import "./manga-styles/MangaView.css";
import { useParams } from "react-router-dom";
import { getChapterImages } from "./services/comickAPI";

const MangaView = () => {
    const { chapterHid } = useParams();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imgs = await getChapterImages(chapterHid);
                console.log("📥 Received images:", imgs);
                setImages(imgs);
            } catch (err) {
                console.error("❌ Error in MangaView:", err);
            } finally {
                setLoading(false); // <- THIS WAS MISSING
            }
        };

        fetchImages();
    }, [chapterHid]);



    if (loading) return <div className="manga-loading">Loading pages...</div>;

    return (
        <div className="manga-pages">
            {images.length > 0 ? (
                images.map((url, idx) => (
                    <img
                        key={idx}
                        src={url}
                        alt={`Page ${idx + 1}`}
                        className="manga-page"
                    />
                ))
            ) : (
                <p className="manga-error">No pages found for this chapter.</p>
            )}
        </div>
    );
};

export default MangaView;


