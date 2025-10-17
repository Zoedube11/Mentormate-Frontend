import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [signinShowPassword, setSigninShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  
// useEffect(() => {
//   const user = localStorage.getItem("user") || localStorage.getItem("token");
//   if (user) {
//     navigate("/mentormate-homepage");
    //   }
  // }, [navigate]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage("❌ " + (data.error || `Server returned ${res.status}`));
      return;
    }

      const data = await res.json();
        localStorage.setItem("token", data.token);
        setMessage("✅ Sign-in successful!");
        setTimeout(() => navigate("/mentormate-homepage"), 800);
          } catch (err) {
      setMessage("⚠️ " + err.message);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + (data.message || "Password reset link sent!"));
        setShowForgot(false);
      } else {
        setMessage("❌ " + (data.error || "Failed to send reset link."));
      }
    } catch (err) {
      setMessage("⚠️ " + err.message);
    }
  };

  
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("✅ Google User:", decoded);
      localStorage.setItem("user", JSON.stringify(decoded));
      navigate("/mentormate-homepage");
    } catch (err) {
      console.error("Error decoding Google token", err);
      setMessage("Failed to process Google login.");
    }
  };

  
  const handleGoogleError = () => {
    setMessage("Google Sign-In failed. Please try again.");
  };

  
  const handleMicrosoft = () => {
    setMessage("Microsoft sign-in clicked (add OAuth logic).");
  };

  return (
    <div>
      {!showForgot ? (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-700">Sign in</h2>
          <p className="text-gray-500 text-sm">Log in to unlock instant expertise</p>

          
          <div>
            <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          
          <div className="relative">
            <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="signin-password"
              type={signinShowPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/8 text-gray-500 text-lg"
              onClick={() => setSigninShowPassword(!signinShowPassword)}
              aria-label="Toggle password visibility"
            >
              👁️
            </button>
          </div>

          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              Keep me signed in
            </label>
            <button type="button" onClick={() => setShowForgot(true)} className="text-teal-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600">
            Sign in
          </button>

          <div className="text-center text-gray-400 my-4">or</div>

<div className="flex flex-col gap-4 w-full max-w-[300px]">
          
{/* Google button wrapper */}
          <div className="w-full rounded-md flex justify-center items-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="291"
              size="extra large"
              text="continue_with"
            />
</div>

          
{/* Microsoft button */}
            <button
              type="button"
              onClick={handleMicrosoft}
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 gap-2 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block">
                <rect x="0" y="0" width="11" height="11" fill="#F35325" />
                <rect x="13" y="0" width="11" height="11" fill="#81BC06" />
                <rect x="0" y="13" width="11" height="11" fill="#05A6F0" />
                <rect x="13" y="13" width="11" height="11" fill="#FFBA08" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

        </form>
      ) : (
        // Forgot password form
        <form onSubmit={handleForgotPassword} className="space-y-4 p-6 rounded-2xl">
          <h2 className="text-xl font-bold">Forgot Password</h2>
          <p className="text-gray-600 text-sm">Enter your email to reset your password</p>
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            className="block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600">
            Send Reset Link
          </button>
          <button type="button" onClick={() => setShowForgot(false)} className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">
            Back to Sign In
          </button>
          {message && <p className="text-sm text-red-500">{message}</p>}
        </form>
      )}
    </div>
  );
}
