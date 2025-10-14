import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImg from "../assets/logo.png";
import Loader from "./Loader";

export default function Navbar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    if (window.innerWidth < 768) { // Mobile
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/auth"); // Go to auth page ONLY
      }, 1200);
    } else {
      console.log("Desktop view: do nothing extra");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <nav className="w-full bg-white shadow-md flex justify-between items-center px-6 py-3 relative z-10">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src={LogoImg} alt="Logo" className="h-16 mr-3" />
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGetStarted}
            className="group relative overflow-hidden rounded-full border-2 border-[#074f8a] bg-[#074f8a] px-4 py-1 font-bold uppercase transition-all duration-200"
          >
            <span className="relative z-10 text-[#3cd9ed] transition-colors duration-200 group-hover:text-[#074f8a]">
              Get Started
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
