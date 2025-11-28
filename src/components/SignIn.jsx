import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [signinShowPassword, setSigninShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data in localStorage (for display purposes only)
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        if (data.user.picture) localStorage.setItem("userPicture", data.user.picture);
        
        // Check session after login
        try {
          const sessionRes = await fetch("http://localhost:5000/api/check-session", {
            credentials: 'include'
          });
          const sessionData = await sessionRes.json();
          if (sessionRes.ok && sessionData.authenticated) {
            setMessage("✅ Sign-in successful! Session active.");
            setTimeout(() => navigate("/mentormate-homepage"), 1000);
          } else {
            setMessage("⚠️ Sign-in succeeded, but session not active.");
            setTimeout(() => navigate("/"), 1500);
          }
        } catch (err) {
          setMessage("⚠️ Sign-in succeeded, but session check failed: " + err.message);
          setTimeout(() => navigate("/mentormate-homepage"), 1500);
        }
      } else {
        setMessage("❌ " + (data.error || "Sign-in failed."));
      }
    } catch (err) {
      setMessage("⚠️ " + err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
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
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
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
              className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/6 text-gray-500 text-lg"
              onClick={() => setSigninShowPassword(!signinShowPassword)}
              aria-label="Toggle password visibility"
            >
              👁️
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
            {/* Checkbox + label */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1d78a3] focus:ring-[#1d78a3]" />
              <span className="whitespace-nowrap">Keep me signed in</span>
            </label>

            {/* Forgot password link */}
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-[#1d78a3] hover:text-[#1d78a3] hover:underline whitespace-nowrap text-left sm:text-right"
            >
              Forgot password?
            </button>
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <button type="submit" className="w-full bg-[#1d78a3] text-white py-2 rounded-md font-semibold hover:bg-[#1d78a3]">
            Sign in
          </button>

          <div className="text-center text-gray-400 my-4">or</div>

          <div className="flex flex-col gap-4 w-full max-w-[300px]">
            {/* Google SVG Button */}
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:5000/login/google'}
              className="w-full py-3.5 text-base font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            {/* Microsoft SVG Button */}
            <button
              type="button"
              className="w-full py-3.5 text-base font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
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
            className="block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
          />
          <button type="submit" className="w-full bg-[#1d78a3] text-white py-2 rounded-md font-semibold hover:bg-[#1d78a3]">
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