import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext"; // ✅

function App() {
  return (
    <AuthProvider> {/* ✅ Global Auth State */}
      <Router>
        <div className="bg-black text-white min-h-screen">
          <Navbar />
          <AppRoutes />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

