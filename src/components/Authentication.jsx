import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Authentication() {
  const [activeTab, setActiveTab] = useState("signin");
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
    <div className="flex justify-center py-10">
      <div className="w-full max-w-md p-8 min-h-[650px] flex flex-col justify-center">
        <div className="flex mb-4 border-b">
          <button className={`flex-1 py-2 text-center font-semibold ${activeTab==="signin"?"border-b-2 border-blue-600":"text-gray-500"}`} onClick={()=>setActiveTab("signin")}>Sign In</button>
          <button className={`flex-1 py-2 text-center font-semibold ${activeTab==="signup"?"border-b-2 border-blue-600":"text-gray-500"}`} onClick={()=>setActiveTab("signup")}>Sign Up</button>
        </div>

        {activeTab==="signin" && <SignIn />}
        {activeTab==="signup" && <SignUp formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
}

