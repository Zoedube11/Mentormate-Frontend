import React from "react";
import Navbar from "../components/Navbar";
import Authentication from "../components/Authentication";
import FAQSection from "../components/FAQSection";
import Experts from "../components/Experts";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Styling*/}
      <div className="flex flex-wrap justify-between p-6">
        {/* FAQ & Experts Styling*/}
        <div className="w-full lg:w-1/2 p-4">
          {/* Experts Section */}
          <div className="experts-container mb-6">
            <Experts />
          </div>
          {/* FAQ Section */}
          <div className="faq-container">
            <FAQSection />
          </div>
        </div>

        {/* Right Column: Authentication */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex flex-col justify-center">
            <Authentication />
          </div>
        </div>
      </div>
    </div>
  );
}