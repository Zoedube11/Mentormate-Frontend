import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const name = params.get("name");
    const picture = params.get("picture");

    console.log("GoogleCallback - Received params:", { email, name, picture });

    if (email) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      if (picture) localStorage.setItem("userPicture", picture);
      
      console.log("GoogleCallback - Stored in localStorage, checking session...");
      
      // Verify session is active
      fetch("http://localhost:5000/api/check-session", { 
        credentials: 'include' 
      })
        .then(res => {
          console.log("GoogleCallback - Session check response status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("GoogleCallback - Session data:", data);
          if (data.authenticated) {
            setMessage("✅ Google sign-in successful! Redirecting...");
            setTimeout(() => navigate("/mentormate-homepage"), 1000);
          } else {
            setMessage("⚠️ Session not active. Please try logging in again.");
            console.warn("GoogleCallback - Session check returned authenticated: false", data);
            setTimeout(() => navigate("/"), 2000);
          }
        })
        .catch(err => {
          console.error("GoogleCallback - Session check error:", err);
          setMessage("⚠️ Connection error. Redirecting to homepage...");
          // Still redirect to homepage since user data is in localStorage
          setTimeout(() => navigate("/mentormate-homepage"), 1500);
        });
    } else {
      console.error("GoogleCallback - No email in params");
      setMessage("❌ Google sign-in failed. Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      <p>{message}</p>
    </div>
  );
}

