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
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-6 lg:p-8 border border-gray-100">
            <Experts />
          </div>
          <div className="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-6 lg:p-8 border border-gray-100">
            <FAQSection />
          </div>
        </div>
        {!isMobile && (
          <div className="lg:w-1/2 flex justify-center items-start lg:sticky lg:top-8 lg:self-start">
            <div className="w-full bg-white shadow-xl rounded-2xl p-8 lg:p-10 border border-gray-200">
              <Authentication />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}