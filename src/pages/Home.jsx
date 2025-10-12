import React from "react";
import Authentication from "../components/Authentication";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Right Column: Authentication */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex flex-col justify-center">
          <Authentication />
        </div>
      </div>
    </div>
  );
}
