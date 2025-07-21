import React from "react";
import "../user-styles/UserProfileDropdown.css";
import { useNavigate } from "react-router-dom";
import dummyAvatar from "../../assets/nao-tomori.png";

const UserProfileDropdown = ({ user, onLogout }) => {
    const navigate = useNavigate();

    // Build full image path with fallback
    const avatarSrc = user?.profilePic
        ? `${user.profilePic}?t=${Date.now()}` // No leading slash
        : dummyAvatar;

    return (
        <div className="profile-dropdown">
            <div className="profile-info">
                <img
                    src={avatarSrc}
                    alt="avatar"
                    className="avatar"
                />
                <div>
                    <div className="username">{user?.username || "Username"}</div>
                    <div className="email">{user?.email || "email@example.com"}</div>
                </div>
            </div>

            <div className="profile-actions">
                <button onClick={() => navigate("/profile")}>Custom Profile</button>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default UserProfileDropdown;

