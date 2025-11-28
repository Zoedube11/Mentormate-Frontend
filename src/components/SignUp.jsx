import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp({ formData, handleChange }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleNextStep = () => {
    // Password validation on Step 2
    if (step === 2) {
      if (!formData.password || formData.password.length < 6) {
        setMessage("⚠️ Password must be at least 6 characters long.");
        return;
      }
    }
    setMessage("");
    nextStep();
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login: persist the new user's identity and clear stale caches
        const user = data.user || {};
        const email = user.email || formData.email;
        const firstName = user.firstName || formData.firstName || "";
        const lastName = user.lastName || formData.lastName || "";

        try {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", `${firstName} ${lastName}`.trim());
          if (user.picture) localStorage.setItem("userPicture", user.picture);
          // Clear any cached chat history from previous users
          localStorage.removeItem("mamadudu_chat_history_v3");
        } catch (_) {}

        // Optionally verify session, then navigate
        try {
          const sessionRes = await fetch("http://localhost:5000/api/check-session", { credentials: 'include' });
          const sessionData = await sessionRes.json();
          if (sessionRes.ok && sessionData.authenticated) {
            setMessage("✅ Account created and signed in!");
            setTimeout(() => navigate("/mentormate-homepage"), 800);
          } else {
            setMessage("✅ Account created. Redirecting...");
            setTimeout(() => navigate("/mentormate-homepage"), 800);
          }
        } catch (err) {
          setMessage("✅ Account created. Redirecting...");
          setTimeout(() => navigate("/mentormate-homepage"), 800);
        }
      } else {
        setMessage("❌ " + (data.error || "Sign-up failed."));
      }
    } catch (err) {
      setMessage("⚠️ " + err.message);
    }
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600">Step {step} of 3</span>
          <span className="text-xs font-medium text-gray-600">{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#1d78a3] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Personal Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
            />
          </div>
          <button
            type="button"
            onClick={nextStep}
            className="w-full bg-[#1d78a3] text-white py-2 rounded-md font-semibold hover:bg-[#1d78a3]"
          >
            Next
          </button>

        </div>
      )}


      {/* End of Step 1 */}

      {/* Step 2: Account Setup */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Account Setup</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1d78a3]"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/6 text-gray-500 text-lg"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              👁️
            </button>
          </div>

          {/* Validation Message */}
          {message && (
            <p className="text-sm text-red-500 font-medium">{message}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={prevStep}
              className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-2/3 bg-[#1d78a3] text-white py-2 rounded-md hover:bg-[#1d78a3]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Almost Done!</h3>

          <div className="bg-[#1d78a3] border border-[#1d78a3] rounded-lg p-4">
            <p className="text-sm text-black-700 mb-2"><span className="font-semibold">Review your information:</span></p>
            <p className="text-sm text-black-600">{formData.firstName} {formData.lastName}</p>
            <p className="text-sm text-black-600">{formData.email}</p>
            <p className="text-sm text-black-600">{formData.phone}</p>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-1 mr-2"
            />
            <p className="text-sm text-gray-700">
              I agree to the{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d78a3] hover:underline font-medium"
              >
                Terms and Conditions
              </Link>
              .
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 text-base font-semibold bg-[#1d78a3] text-white rounded-lg hover:bg-[#1d78a3] transition-colors mt-4"
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={prevStep}
            className="w-full py-3.5 text-base font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
    </form>
  );
}


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function SignUp({ formData, handleChange }) {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       setMessage("⚠️ Passwords do not match.");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage("✅ Account created successfully!");
//         setTimeout(() => navigate("/mentormate-homepage"), 1000);
//       } else {
//         setMessage("❌ " + (data.error || "Sign-up failed."));
//       }
//     } catch (err) {
//       setMessage("⚠️ " + err.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h2 className="text-xl font-bold text-gray-800 mb-2">Create Account</h2>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Birth Date</label>
//         <input
//           type="date"
//           name="birthDate"
//           value={formData.birthDate}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//         <input
//           type="tel"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
//         />
//       </div>

//       <div className="relative">
//         <label className="block text-sm font-medium text-gray-700">Password</label>
//         <input
//           type={showPassword ? "text" : "password"}
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-teal-500"
//         />
//         <button
//           type="button"
//           className="absolute right-2 top-1/2 transform -translate-y-1/6 text-gray-500"
//           onClick={() => setShowPassword(!showPassword)}
//         >
//           👁️
//         </button>
//       </div>

//       <div className="relative">
//         <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           name="confirmPassword"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-teal-500"
//         />
//         <button
//           type="button"
//           className="absolute right-2 top-1/2 transform -translate-y-1/6 text-gray-500"
//           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//         >
//           👁️
//         </button>
//       </div>

//       <div className="flex items-start">
//         <input
//           type="checkbox"
//           name="terms"
//           checked={formData.terms}
//           onChange={handleChange}
//           required
//           className="mt-1 mr-2"
//         />
//         <p className="text-sm text-gray-700">
//           I agree to the{" "}
//           <Link to="/terms" className="text-teal-600 hover:underline font-medium">
//             Terms and Conditions
//           </Link>
//           .
//         </p>
//       </div>

//       {message && <p className="text-sm text-red-500 font-medium">{message}</p>}

//       <button
//         type="submit"
//         className="w-full py-3 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors"
//       >
//         Create Account
//       </button>
//     </form>
//   );
// }
