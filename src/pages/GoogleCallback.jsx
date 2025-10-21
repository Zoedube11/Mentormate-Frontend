import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const name = params.get("name");

    if (email) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      navigate("/mentormate-homepage"); // <-- Directly go to dashboard
    } else {
      navigate("/"); // fallback to public home
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      <p>Signing you in with Google...</p>
    </div>
  );
}

