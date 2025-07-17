// user/LoginModal.js
import React, { useState } from "react";
import "./user-styles/LoginModal.css";
import LoginForm from "./user-components/LoginForm";
import RegisterForm from "./user-components/RegisterForm";
import ForgotPasswordForm from "./user-components/ForgotPasswordForm";

const LoginModal = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false); // ✅ New state

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => {
    setIsRegistering(false);
    setIsForgotPassword(false);
  };
  const switchToForgotPassword = () => {
    setIsRegistering(false);
    setIsForgotPassword(true);
  };

  // ✅ Close modal and pass correct success state
  const handleBackdropClose = () => {
    onClose(loginSuccessful); // Will only be true if LoginForm sets it
  };

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
            onClose={() => {
              setLoginSuccessful(true);   // ✅ Set success
              onClose(true);              // ✅ Then close
            }}
            switchToRegister={switchToRegister}
            switchToForgotPassword={switchToForgotPassword}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal;

