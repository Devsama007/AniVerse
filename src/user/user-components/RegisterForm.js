import React, { useState } from "react";
import "../user-styles/RegisterForm.css";
import captcha from "../../assets/recaptcha.png";
import videoBg from "../../assets/anime nature.mp4";
import confetti from "canvas-confetti";

const RegisterForm = ({ onClose, switchToLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, email, password, confirmPassword } = formData;

        // ✅ Simple frontend validation
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                setIsLoading(false);
                return;
            }

            setIsSuccess(true);
            setSuccessMessage("🎉 Registration Successful!");

            // firework animation
            confetti({
                particleCount: 120,
                spread: 160,
                origin: { y: 0.6 },
                colors: ["#f87171", "#60a5fa", "#4ade80", "#facc15", "#a78bfa", "#f472b6"]
            });

            // Optional: auto switch to login after 2s
            setTimeout(() => {
                setIsLoading(false);
                switchToLogin();
            }, 1800);

        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration");
            setIsLoading(false);
        }

    };


    return (
        <div className="register-form-wrapper">
            <div className="register-form-video-wrapper">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="register-background-video"
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Create Your Account</h2>

                <label htmlFor="username">USERNAME</label>
                <input
                    type="text"
                    placeholder="$ABC123"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">EMAIL</label>
                <input
                    type="email"
                    placeholder="name@email.com"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">PASSWORD</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {/* ReCAPTCHA Placeholder */}
                <div className="recaptcha-box">
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
                    className={`register-btn ${isLoading ? "loading" : ""} ${isSuccess ? "success" : ""}`}
                    disabled={isLoading}
                >
                    {isSuccess ? (
                        <span className="checkmark">&#10003;</span>
                    ) : isLoading ? (
                        "Registering..."
                    ) : (
                        "Register"
                    )}
                </button>

                {/* 🎉 Success Message */}
                {isSuccess && <p className="register-success">{successMessage}</p>}


                <p className="switch-auth">
                    Already have an account?{" "}
                    <span onClick={switchToLogin}>Login</span>
                </p>
            </form>
        </div>

    );
};

export default RegisterForm;
