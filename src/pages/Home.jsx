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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar />

      <div className="flex flex-col lg:flex-row w-full flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
        {/* Left side content (plain, no cards) */}
        <div className="lg:w-1/2 flex flex-col gap-10">
          <Experts />
          <FAQSection />
        </div>

        {/* Right side: Authentication inside a white card */}
        {!isMobile && (
          <div className="lg:w-1/2 flex justify-center items-start lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
              <Authentication />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
