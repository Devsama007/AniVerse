import React, { useRef, useState } from "react";
import "../user-styles/Profile.css";
import dummyBanner from "../../assets/nao-tomori.png"; // Fallback banner
import defaultAvatar from "../../assets/nao-tomori.png"; // Add a fallback avatar if needed
import { FaPen } from "react-icons/fa";
import axios from "axios";

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


        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };

    return (
        <div className="profile-page">
            {/* Banner */}
            <div
                className="profile-banner"
                style={{
                    backgroundImage: `url(${(currentUser?.bannerImage || dummyBanner)}?${Date.now()})`,
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
                            backgroundImage: `url(${(currentUser?.profilePic || defaultAvatar)}?${Date.now()})`,
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
                <p>{currentUser?.profileText || "This user hasn't added a bio yet."}</p>
                <p className="member-date">
                    Aniverse Member since: {new Date(currentUser?.createdAt).toDateString()}
                </p>
            </div>

            {/* Watch/Read history */}
            <div className="profile-history">
                <h3>🎬 Last Watched Anime</h3>
                <div className="history-grid">
                    <img src="/dummy-anime.jpg" alt="anime" />
                </div>
                <h3>📚 Last Read Manga</h3>
                <div className="history-grid">
                    <img src="/dummy-manga.jpg" alt="manga" />
                </div>
            </div>
        </div>
    );
};

export default Profile;



