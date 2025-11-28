import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function AuthPage() {
  const location = useLocation();
  const [tab, setTab] = useState("signin");
  const [sessionMessage, setSessionMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", birthDate: "", phone: "",
    email: "", password: "", confirmPassword: "", terms: false,
  });

  // Check for session expiration message
  useEffect(() => {
    if (location.state?.sessionExpired && location.state?.message) {
      setSessionMessage(location.state.message);
      // Clear message after 8 seconds
      const timer = setTimeout(() => setSessionMessage(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Session expiration notification */}
        {sessionMessage && (
          <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm font-medium">{sessionMessage}</p>
            </div>
          </div>
        )}

        <div className="flex mb-4 border-[#1d78a3]">
          <button
            className={`flex-1 py-2 text-center font-semibold ${tab==="signin" ? "border-[#1d78a3]-2 border-[#1d78a3]" : "text-gray-500"}`}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold ${tab==="signup" ? "border-[#1d78a3]-2 border-[#1d78a3]" : "text-gray-500"}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {tab === "signin" ? <SignIn /> : <SignUp formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
}