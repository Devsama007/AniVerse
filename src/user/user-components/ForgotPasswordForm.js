import React, { useState } from "react";
import "../user-styles/ForgotPasswordForm.css";
import videoBg from "../../assets/tenki no ko.mp4";

const ForgotPasswordForm = ({ onClose, switchToLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            setMessage("❌ Passwords do not match");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Password reset failed");
            }

            setIsSuccess(true);
            setMessage("✅ Password reset successful!");

            setTimeout(() => {
                switchToLogin();
                onClose();
            }, 1500);
        } catch (error) {
            setMessage(`❌ ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="forgot-password-container">

            <div className="forgot-password-video-wrapper">

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="login-background-video"
                >
                    <source src={videoBg} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

            </div>

            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>

                <label htmlFor="email">EMAIL</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your registered email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="newPassword">NEW PASSWORD</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {message && <p className="forgot-message">{message}</p>}

                <button
                    type="submit"
                    className={`reset-btn ${isLoading ? "loading" : ""} ${isSuccess ? "success" : ""}`}
                    disabled={isLoading}
                >
                    {isSuccess ? (
                        <span className="checkmark">&#10003;</span>
                    ) : isLoading ? (
                        "Resetting..."
                    ) : (
                        "Reset Password"
                    )}
                </button>

                <div className="switch-auth">
                    <span onClick={switchToLogin}>Back to Login</span>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
