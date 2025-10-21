import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function AuthPage() {
  const [tab, setTab] = useState("signin");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", birthDate: "", phone: "",
    email: "", password: "", confirmPassword: "", terms: false,
  });

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
        <div className="flex mb-4 border-b">
          <button
            className={`flex-1 py-2 text-center font-semibold ${tab==="signin" ? "border-b-2 border-teal-500" : "text-gray-500"}`}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold ${tab==="signup" ? "border-b-2 border-teal-500" : "text-gray-500"}`}
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