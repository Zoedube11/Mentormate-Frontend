import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="relative w-16 h-8 flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-3 h-3 bg-[#074f8a] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></span>
        ))}
      </div>
    </div>
  );
}
