import { useState } from "react";

export default function SignIn() {
  const [signinShowPassword, setSigninShowPassword] = useState(false);

  return (
    <form className="space-y-4">
      <h2 className="text-xl font-bold">Sign in</h2>
      <p className="text-gray-600 text-sm">Log in to unlock instant expertise</p>

      <div>
        <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="signin-email"
          placeholder="Email"
          required
          className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type={signinShowPassword ? "text" : "password"}
          id="signin-password"
          placeholder="Password"
          required
          className="mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
          onClick={() => setSigninShowPassword(!signinShowPassword)}
        >
          👁️
        </button>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <label className="flex items-center">
          <input type="checkbox" className="mr-1" />
          Keep me signed in
        </label>
        <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Sign in
      </button>

      <div className="text-center my-4 text-gray-400">or</div>

      {/* Google Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      {/* Microsoft Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <rect x="0" y="0" width="11" height="11" fill="#F35325"/>
          <rect x="13" y="0" width="11" height="11" fill="#81BC06"/>
          <rect x="0" y="13" width="11" height="11" fill="#05A6F0"/>
          <rect x="13" y="13" width="11" height="11" fill="#FFBA08"/>
        </svg>
        Continue with Microsoft
      </button>
    </form>
  );
}
