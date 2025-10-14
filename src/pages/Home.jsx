import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Experts from "../components/Experts";
import FAQSection from "../components/FAQSection";
import Authentication from "../components/Authentication";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-col lg:flex-row w-full flex-1 px-6 py-10 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 flex flex-col justify-center">
            <Experts />
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 flex flex-col justify-center">
            <FAQSection />
          </div>
        </div>

        {/* RIGHT SIDE - only show on desktop */}
        {!isMobile && (
          <div className="lg:w-1/2 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-10 flex flex-col justify-center">
              {/* Render your Authentication component here for desktop */}
              <Authentication />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
