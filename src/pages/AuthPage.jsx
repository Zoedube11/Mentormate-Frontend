// src/components/RedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Example: Only redirect if a token or user data exists
    const token = localStorage.getItem("token");
    if (token) {
      const timer = setTimeout(() => {
        navigate("/mentormate-homepage");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
      Redirecting to MentorMate...
    </div>
  );
}
