// src/components/RedirectHandler.jsx
import { useEffect } from "react";

export default function RedirectHandler() {
  useEffect(() => {
    // Automatically redirect to your React app after login
    const timer = setTimeout(() => {
      // window.location.href = "http://localhost:3000/mentormate-homepage";
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
      Redirecting to MentorMate...
    </div>
  );
}
