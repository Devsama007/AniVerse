// user/LoginModal.js
import React, { useState } from "react";
import "./user-styles/LoginModal.css";
import LoginForm from "./user-components/LoginForm";
import RegisterForm from "./user-components/RegisterForm";
import ForgotPasswordForm from "./user-components/ForgotPasswordForm";

const LoginModal = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => {
    setIsRegistering(false);
    setIsForgotPassword(false);
  };
  const switchToForgotPassword = () => {
    setIsRegistering(false);
    setIsForgotPassword(true);
  };

  const handleBackdropClose = () => onClose(false); // false: login not successful

  return (
    <div className="login-modal-backdrop" onClick={handleBackdropClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleBackdropClose}>×</button>

        {isRegistering ? (
          <RegisterForm onClose={handleBackdropClose} switchToLogin={switchToLogin} />
        ) : isForgotPassword ? (
          <ForgotPasswordForm onClose={handleBackdropClose} switchToLogin={switchToLogin} />
        ) : (
          <LoginForm
            onSuccess={() => onClose(true)} // ✅ Trigger parent only when login succeeds
            switchToRegister={switchToRegister}
            switchToForgotPassword={switchToForgotPassword}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
