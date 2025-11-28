import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectHandler() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user has active session
    fetch("http://localhost:5000/api/check-session", {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          navigate("/mentormate-homepage");
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        navigate("/");
      })
      .finally(() => {
        setChecking(false);
      });
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return null;
}
