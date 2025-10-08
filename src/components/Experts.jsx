import React, { useEffect, useRef, useState } from "react";
import MamaDuduImg from "../assets/character3.png";
import OomPietImg from "../assets/character.png";
import BraVusiImg from "../assets/character2.png";
import MrRakeshImg from "../assets/character4.png";
import SisNandiImg from "../assets/character5.png";

export default function Experts() {
  const experts = [
    { name: "Mama Dudu", image: MamaDuduImg, areas: ["Environmental Engineering", "Water Management", "Wastewater treatment"] },
    { name: "Oom Piet", image: OomPietImg, areas: ["Soil mechanics", "Geology and hydrogeology", "Tailings Engineering"] },
    { name: "Bra Vusi", image: BraVusiImg, areas: ["Concrete construction", "Structural design", "Foundations"] },
    { name: "Mr Rakesh", image: MrRakeshImg, areas: ["Electrical power systems", "Integrated energy planning", "Renewables"] },
    { name: "Sis Nandi", image: SisNandiImg, areas: ["Metallurgical processes", "Resource characterisation", "Mining Engineering"] },
  ];

  const containerRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const scrollSpeed = 0.5; 
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  // Duplicate experts for seamless loop
  const duplicatedExperts = [...experts, ...experts, ...experts];

  useEffect(() => {
    let animationId;

    const animate = () => {
      const container = containerRef.current;
      if (!container) return;

      const totalWidth = container.scrollWidth / 3; 

      setOffset(prev => {
        const newOffset = prev + scrollSpeed;
        if (newOffset >= totalWidth) return 0;
        return newOffset;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose your expert below!
      </h2>

      <div className="overflow-hidden w-full" ref={containerRef}>
        <div
          className="flex gap-6"
          style={{
            transform: `translateX(-${offset}px)`,
            transition: "transform 0.05s linear",
          }}
        >
          {duplicatedExperts.map((expert, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[250px] bg-white rounded-xl border border-gray-200 shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
              onClick={() => window.location.href = `/chat_${expert.name.toLowerCase().replace(" ", "_")}`}
            >
              <img
                src={expert.image}
                alt={expert.name}
                className="w-28 h-28 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-semibold text-lg text-gray-900 mb-1 text-center">{expert.name}</h3>
              <p className="text-gray-600 font-medium text-sm mb-2 text-center">Areas of expertise include:</p>
              <ul className="list-disc list-inside text-gray-600 text-sm text-left space-y-1">
                {expert.areas.map((area, i) => <li key={i}>{area}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
