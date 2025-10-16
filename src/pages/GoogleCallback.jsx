import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);

      
      navigate("/mentormate-homepage");
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      <p>Signing you in with Google...</p>
    </div>
  );
}
