// user/LoginForm.js
import React, { useState } from "react";
import "../user-styles/LoginForm.css";
import captcha from "../../assets/recaptcha.png";
import videoBg from "../../assets/your name.mp4";

const LoginForm = ({ onSubmit, switchToRegister, onClose, switchToForgotPassword }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                setIsLoading(false);
                return;
            }

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem("token", data.token);

            setIsSuccess(true);

            // ✅ Wait for animation then close the popup
            setTimeout(() => {
                setIsLoading(false);
                if (onClose) onClose(); // 👈 closes modal after success
            }, 1800);

        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login");
            setIsLoading(false);
        }
    };


    return (

        <div className="fullscreen-wrapper">
            <div className="login-form-video-wrapper">

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
            <div className="login-form-container">

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="login-title">Welcome back!</h2>

                    <label htmlFor="email">EMAIL ADDRESS</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">PASSWORD</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="login-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <span className="forgot-link" onClick={switchToForgotPassword}>
                            Forgot password?
                        </span>
                    </div>

                    {/* reCAPTCHA placeholder */}
                    <div className="recaptcha-container">
                        <div className="recaptcha-checkbox">
                            <input type="checkbox" id="recaptcha" />
                            <label htmlFor="recaptcha">I'm not a robot</label>
                        </div>
                        <div className="recaptcha-right">
                            <img
                                src={captcha}
                                alt="reCAPTCHA"
                                className="recaptcha-image"
                            />

                        </div>
                    </div>


                    <button
                        type="submit"
                        className={`login-button ${isLoading ? "loading" : ""} ${isSuccess ? "success" : ""}`}
                        disabled={isLoading}
                    >
                        {isSuccess ? (
                            <span className="checkmark">&#10003;</span> // ✓ icon
                        ) : isLoading ? (
                            "Logging in..."
                        ) : (
                            "Login"
                        )}
                    </button>


                    <div className="login-footer">
                        <p>
                            Don’t have an account? <span className="link" onClick={switchToRegister}>Register</span> or <span className="link">Verify</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
