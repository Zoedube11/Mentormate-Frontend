import { useState, useRef, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import MentorMateLogo from "../assets/logo.png"; 

import MamaDuduImg from "../assets/character3.png";
import OomPietImg from "../assets/character.png";
import BraVusiImg from "../assets/character2.png";
import MrRakeshImg from "../assets/character4.png";
import SisNandiImg from "../assets/character5.png";

export default function MentorMateHome() {
  const navigate = useNavigate(); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock logged-in user
  const user = {
    initials: "ZD",
    name: "Zoe Dube",
    email: "zoe@skxconsulting.co.za",
  };

  const experts = [
    {
      name: "Mama Dudu",
      image: MamaDuduImg,
      areas: ["Environmental Engineering", "Water Management", "Wastewater Treatment"],
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      name: "Oom Piet",
      image: OomPietImg,
      areas: ["Soil Mechanics", "Geology & Hydrogeology", "Tailings Engineering"],
      gradient: "from-amber-400 to-orange-500",
    },
    {
      name: "Bra Vusi",
      image: BraVusiImg,
      areas: ["Concrete Construction", "Structural Design", "Foundations"],
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      name: "Mr Rakesh",
      image: MrRakeshImg,
      areas: ["Electrical Power Systems", "Integrated Energy Planning", "Renewables"],
      gradient: "from-purple-400 to-pink-500",
    },
    {
      name: "Sis Nandi",
      image: SisNandiImg,
      areas: ["Metallurgical Processes", "Resource Characterisation", "Mining Engineering"],
      gradient: "from-rose-400 to-red-500",
    },
  ];

  const containerRef = useRef(null);
  const profileRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const scrollSpeed = 0.3;

  const duplicatedExperts = [...experts, ...experts, ...experts];

  // Scroll animation
  useEffect(() => {
    let animationId;

    const animate = () => {
      const container = containerRef.current;
      if (!container) return;

      const totalWidth = container.scrollWidth / 3;
      setOffset((prev) => (prev + scrollSpeed >= totalWidth ? 0 : prev + scrollSpeed));

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChatClick = (expertName) => {
    window.location.href = `/chat_${expertName.toLowerCase().replace(" ", "_")}`;
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={MentorMateLogo} alt="MentorMate Logo" className="h-16 mr-3" />
          </div>

          {/* Navbar buttons */}
          <div className="flex gap-4 items-center relative" ref={profileRef}>
            {user && (
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                Profile
              </button>
            )}

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                {/* Logout link */}
                <div className="flex justify-end p-2 border-b border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    Logout
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex items-center p-4 gap-4">
                  <div className="bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                    {user.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-gray-500 text-sm">{user.email}</div>
                  </div>
                </div>

                {/* Links */}
                <div className="border-t border-gray-200">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                    View Account
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                    My Microsoft
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
              ✨ Your Gateway to Instant Expertise
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MentorMate
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              MentorMate is a tool designed to provide specialised instant expertise to built environment professionals. 
              It offers locally relevant advice across various knowledge areas, including geotechnical, water management, 
              concrete construction, environmental management, structural design and more.
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Each expert persona represents a different discipline and is built using accurate Southern Africa contextual 
              data, legislation, and case studies. They're designed to simulate conversations with seasoned local mentors. 
              <span className="font-semibold text-teal-600"> Start your conversation now!</span>
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Specialized Expertise</h3>
              <p className="text-gray-600">Access expert knowledge across multiple engineering disciplines</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Locally Relevant</h3>
              <p className="text-gray-600">Built with Southern African context, legislation, and case studies</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Mentorship</h3>
              <p className="text-gray-600">Engage in natural conversations with seasoned mentors</p>
            </div>
          </div>
        </div>

        {/* Expert Cards Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Choose Your Expert
          </h2>
          <p className="text-center text-gray-600 text-lg mb-10">
            Select from our diverse team of specialized mentors
          </p>

          <div className="overflow-hidden py-8" ref={containerRef}>
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
                  className="relative w-80 min-h-[420px] group cursor-pointer flex-shrink-0"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                       style={{background: `linear-gradient(to bottom right, ${expert.gradient})`}}>
                  </div>

                  <div className="relative h-full bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl border border-gray-100">
                    <div className={`h-24 bg-gradient-to-r ${expert.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex justify-center -mt-16 mb-4">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${expert.gradient} rounded-full blur-md opacity-50`}></div>
                        <img
                          src={expert.image}
                          alt={expert.name}
                          className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                      </div>
                    </div>

                    <div className="px-6 pb-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {expert.name}
                      </h3>

                      <div className="space-y-2 mb-6">
                        {expert.areas.map((area, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg py-2 px-3 hover:bg-gray-100 transition-colors"
                          >
                            <span className="mr-2">•</span>
                            {area}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleChatClick(expert.name)}
                        className={`w-full py-3 px-6 bg-gradient-to-r ${expert.gradient} text-white font-semibold rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1`}
                      >
                        Start Conversation →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Expert Guidance?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Select an expert above and start your conversation today
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1">
              Browse Experts
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-teal-600 transition-all transform hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.8s ease-out; 
        }
      `}</style>
    </div>
  );
}
