import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MicrosoftCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const name = params.get("name");
    const picture = params.get("picture");

    if (email) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("userPicture", picture);
      navigate("/mentormate-homepage");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      <p>Signing you in with Microsoft...</p>
    </div>
  );
}
