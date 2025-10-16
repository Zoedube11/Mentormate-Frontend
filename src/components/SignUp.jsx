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

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setMessage("✅ Account created successfully!");
        setTimeout(() => navigate("/mentormate-homepage"), 1000);
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
            className="bg-teal-500 h-2 rounded-full transition-all duration-300 ease-in-out"
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
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="button"
            onClick={nextStep}
            className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600"
          >
            Next
          </button>
        </div>
      )}

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
              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              👁️
            </button>
          </div>

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
              onClick={nextStep}
              className="w-2/3 bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Review your information:</span></p>
            <p className="text-sm text-gray-600">{formData.firstName} {formData.lastName}</p>
            <p className="text-sm text-gray-600">{formData.email}</p>
            <p className="text-sm text-gray-600">{formData.phone}</p>
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
                className="text-teal-600 hover:underline font-medium"
              >
                Terms and Conditions
              </Link>
              .
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 text-base font-semibold bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors mt-4"
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

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
           onClick={() => window.location.href = "http://127.0.0.1:5000/login?next=http://localhost:3000/"}
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


          {/* Microsoft Button */}
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