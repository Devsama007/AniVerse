import React, { useRef, useState, useEffect } from "react";
import "../user-styles/Profile.css";
import dummyBanner from "../../assets/nao-tomori.png"; // Fallback banner
import defaultAvatar from "../../assets/nao-tomori.png"; // Fallback avatar
import { FaPen } from "react-icons/fa";
import axios from "axios";
import Card from "../../components/Card";
import { Link } from "react-router-dom";

const Profile = () => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"))
    );

    const getToken = () => {
        return sessionStorage.getItem("token") || localStorage.getItem("token");
    };

    const token = getToken();
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [cacheBuster, setCacheBuster] = useState(Date.now());
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState(currentUser?.profileText || "");

    const handleFileChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type); // 'profilePic' or 'bannerImage'

        try {
            const res = await axios.put("http://localhost:5000/api/user/update-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedUser = res.data.user;
            setCurrentUser(updatedUser);

            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("userUpdated"));

            setCacheBuster(Date.now()); // Only bust cache after upload
        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };

    // Anime Manga History
    const [animeHistory, setAnimeHistory] = useState([]);
    const [mangaHistory, setMangaHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = getToken();
                const res = await axios.get("http://localhost:5000/api/user/history", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // const history = res.data || [];

                // Split into anime and manga arrays
                const { animeHistory = [], mangaHistory = [] } = res.data;

                setAnimeHistory(animeHistory.slice(0, 6));
                setMangaHistory(mangaHistory.slice(0, 6));
            } catch (err) {
                console.error("Failed to fetch history:", err);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="profile-page">
            {/* Banner */}
            <div
                className="profile-banner"
                style={{
                    backgroundImage: `url(${(currentUser?.bannerImage || dummyBanner)}?${cacheBuster})`,
                }}
            >
                <div className="edit-banner" onClick={() => bannerInputRef.current.click()}>
                    <FaPen color="#fff" size={14} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={bannerInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e, "bannerImage")}
                    />
                </div>
            </div>

            {/* Avatar and Info */}
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <div
                        className="profile-avatar"
                        style={{
                            backgroundImage: `url(${(currentUser?.profilePic || defaultAvatar)}?${cacheBuster})`,
                        }}
                    ></div>
                    <div className="edit-avatar" onClick={() => avatarInputRef.current.click()}>
                        <FaPen color="#fff" size={14} />
                        <input
                            type="file"
                            accept="image/*"
                            ref={avatarInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "profilePic")}
                        />
                    </div>
                </div>
                <div className="user-info">
                    <h2>{currentUser?.username || "Unknown User"}</h2>
                    <p>{currentUser?.email || "email@example.com"}</p>
                </div>
            </div>

            {/* Bio */}
            <div className="profile-bio">
                <h3>📝 Bio</h3>
                {isEditingBio ? (
                    <>
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            rows={4}
                            className="bio-textarea"
                            placeholder="Write something about yourself..."
                        />
                        <button
                            className="save-bio-btn"
                            onClick={async () => {
                                try {
                                    const res = await axios.put(
                                        "http://localhost:5000/api/user/update-bio",
                                        { profileText: newBio },
                                        {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        }
                                    );

                                    const updatedUser = res.data.user;
                                    setCurrentUser(updatedUser);
                                    const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
                                    storage.setItem("user", JSON.stringify(updatedUser));
                                    setIsEditingBio(false);
                                } catch (err) {
                                    console.error("Error updating bio:", err);
                                }
                            }}
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <p>{currentUser?.profileText || "This user hasn't added a bio yet."}</p>
                        <button className="edit-bio-btn" onClick={() => setIsEditingBio(true)}>
                            Edit Bio
                        </button>
                    </>
                )}
                <p className="member-date">
                    Aniverse Member since: {new Date(currentUser?.createdAt).toDateString()}
                </p>
            </div>

            {/* Watch/Read history */}
            <div className="profile-history">
                <h3>🎬 Last Watched Anime</h3>
                <div className="history-grid">
                    {animeHistory.map((anime, index) => (
                        <Link to={`/anime/${anime.id}`}>
                            <Card
                                key={anime.id}
                                id={anime.id}
                                index={index + 1}
                                title={anime.title}
                                image={anime.image}
                                type="anime"
                                className="anime-history"
                            />
                        </Link>
                    ))}
                </div>

                <h3>📚 Last Read Manga</h3>
                <div className="history-grid">
                    {mangaHistory.map((manga, index) => (
                        <Link to={`/manga/${manga.id}`}>
                            <Card
                                key={manga.id}
                                id={manga.id}
                                index={index + 1}
                                title={manga.title}
                                image={manga.image}
                                type="manga"
                                className="manga-history"
                            />
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Profile;


