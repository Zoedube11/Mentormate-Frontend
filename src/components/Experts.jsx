import React, { useRef, useState, useEffect } from "react";
import MamaDuduImg from "../assets/character3.png";
import OomPietImg from "../assets/character.png";
import BraVusiImg from "../assets/character2.png";
import MrRakeshImg from "../assets/character4.png";
import SisNandiImg from "../assets/character5.png";

export default function Experts() {
  const experts = [
    { name: "Mama Dudu", image: MamaDuduImg, areas: ["Environmental Engineering", "Water Management", "Wastewater Treatment"] },
    { name: "Oom Piet", image: OomPietImg, areas: ["Soil Mechanics", "Geology & Hydrogeology", "Tailings Engineering"] },
    { name: "Bra Vusi", image: BraVusiImg, areas: ["Concrete Construction", "Structural Design", "Foundations"] },
    { name: "Mr Rakesh", image: MrRakeshImg, areas: ["Electrical Power Systems", "Integrated Energy Planning", "Renewables"] },
    { name: "Sis Nandi", image: SisNandiImg, areas: ["Metallurgical Processes", "Resource Characterisation", "Mining Engineering"] },
  ];

  const containerRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const scrollSpeed = 0.5;

  const duplicatedExperts = [...experts, ...experts, ...experts];


  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let animationId;
    const animate = () => {
      const container = containerRef.current;
      if (!container) return;

      const totalWidth = container.scrollWidth / 3;
      setOffset(prev => (prev + scrollSpeed >= totalWidth ? 0 : prev + scrollSpeed));

      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleChatClick = (expertName) => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose your expert below!
      </h2>

      <div className="overflow-hidden w-full py-3" ref={containerRef}>
        <div
          className="flex gap-4"
          style={{ transform: `translateX(-${offset}px)`, transition: "transform 0.05s linear" }}
        >
          {duplicatedExperts.map((expert, index) => (
            <div key={index} className="relative w-64 min-h-[320px] group cursor-pointer flex-shrink-0">
              <div className="absolute inset-0 border-gray-800 rounded-lg -z-10"></div>

              <div className="relative bg-gray-50 border border-gray-800 rounded-lg p-4 overflow-hidden transition-all duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:border-[#5bc0eb] flex flex-col items-center">
                <img src={expert.image} alt={expert.name} className="w-32 h-32 rounded-full object-cover mx-auto" />
                <p className="font-bold text-lg text-center">{expert.name}</p>

                <ul className="list-disc list-inside text-sm text-gray-700 text-left w-full px-4 mt-2">
                  {expert.areas.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>

                <div className="mt-3 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 text-center w-full">
                  <button
                    onClick={() => handleChatClick(expert.name)}
                    className="bg-teal-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-teal-500 transition-colors duration-300"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 w-80 text-center shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Oops!</h3>
            <p className="mb-6">You need to sign up or log in to chat with our mentors.</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#5bc0eb] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#53aed4] transition-colors duration-300"
                onClick={() => window.location.href = "/login"}
              >
                Log In
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300"
                onClick={() => window.location.href = "/signup"}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
