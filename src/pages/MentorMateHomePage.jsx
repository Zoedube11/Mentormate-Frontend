import { useState, useRef, useEffect } from "react";
import MentorMateLogo from "../assets/logo.png";
import MamaDuduImg from "../assets/character3.png";
import OomPietImg from "../assets/character.png";
import BraVusiImg from "../assets/character2.png";
import MrRakeshImg from "../assets/character4.png";
import SisNandiImg from "../assets/character5.png";
import ChatHistory from "../components/ChatHistory";
import { fetchChatSessions, getCollectionDisplayName, getExpertRoute } from "../api/chatHistory";
import { useNavigate } from "react-router-dom";
import { startSessionMonitoring } from "../utils/sessionHandler";

export default function MentorMateHome() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const navigate = useNavigate();

  const experts = [
    {
      name: "Mama Dudu",
      image: MamaDuduImg,
      areas: ["Environmental Engineering", "Water Management", "Wastewater treatment"],
    },
    {
      name: "Oom Piet",
      image: OomPietImg,
      areas: ["Soil mechanics", "Geology and hydrogeology", "Tailings Engineering"],
    },
    {
      name: "Bra Vusi",
      image: BraVusiImg,
      areas: ["Concrete construction", "Structural design", "Foundations"],
    },
    {
      name: "Mr Rakesh",
      image: MrRakeshImg,
      areas: ["Electrical power systems", "Integrated energy planning", "Renewables"],
    },
    {
      name: "Sis Nandi",
      image: SisNandiImg,
      areas: ["Metallurgical processes", "Resource characterisation", "Mining Engineering"],
    },
  ];

  const profileRef = useRef(null);

  // Session monitoring
  useEffect(() => {
    const cleanup = startSessionMonitoring(navigate);
    return cleanup;
  }, [navigate]);

  // Fetch user profile and recent chat history on component mount
  useEffect(() => {
    checkLoginStatus();
    loadRecentHistory();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkLoginStatus = () => {
    // Get user data from localStorage (stored in separate keys)
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userPicture = localStorage.getItem("userPicture");
    
    // Only use picture if it's a valid URL (not a placeholder or default)
    const validPicture = userPicture && 
                        userPicture !== "null" && 
                        userPicture !== "undefined" && 
                        !userPicture.includes("default") && 
                        !userPicture.includes("placeholder") &&
                        (userPicture.startsWith("http") || userPicture.startsWith("data:")) 
                        ? userPicture 
                        : null;
    
    // Check if userName is valid (not "undefined undefined" or empty)
    const isValidName = userName && 
                       userName !== "null" && 
                       userName !== "undefined" && 
                       userName !== "undefined undefined" &&
                       userName.trim().length > 0;
    
    const displayName = isValidName ? userName : userEmail.split('@')[0];
    
    if (userEmail) {
      setUser({
        name: displayName || "User",
        email: userEmail,
        initials: getInitials(displayName || "User"),
        picture: validPicture,
      });
    } else {
      // No user data, show default
      setUser({
        name: "Guest",
        email: "Not logged in",
        initials: "G",
      });
    }
    setLoading(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const loadRecentHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await fetchChatSessions(null, 5); // Get last 5 sessions
      setRecentSessions(data.session || []);
    } catch (err) {
      console.error('Error loading recent history:', err);
      setRecentSessions([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChatClick = (expertName) => {
    window.location.href = `/chat_${expertName.toLowerCase().replace(" ", "_")}`;
  };

  const handleContinueConversation = (session) => {
    const route = getExpertRoute(session.collection_name);
    navigate(route, { state: { conversationId: session.session_id } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return diffDays + ' days ago';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleLogout = async () => {
    try {
      // Remove token and user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Remove all avatar plan selections on logout
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("selectedPlan_")) {
          localStorage.removeItem(key);
        }
      });

      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsProfileOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      setIsProfileOpen(false);
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={MentorMateLogo} alt="MentorMate Logo" className="h-12" />
          </div>
          
          {/* Profile button */}
          {!loading && user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-gray-400 transition-colors overflow-hidden"
                title={user.name}
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.initials}
                  </div>
                )}
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50 overflow-hidden">
                  {/* Profile Info */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="font-semibold text-gray-800 mb-1">{user.name}</div>
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </div>
                  
                  {/* Logout Button */}
                  <div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Welcome to Mentormate
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10">
            Your gateway to instant expertise!
          </p>
         
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 text-gray-700">
            <p className="text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed">
              Mentormate is a tool designed to provide specialised instant expertise to built environment professionals. It offers locally relevant
              advice across various knowledge areas, including geotechnical, water management, concrete construction, environmental management,
              structural design and more.
            </p>
           
            <p className="text-sm sm:text-base md:text-lg leading-normal sm:leading-relaxed">
              Each expert persona represents a different discipline and is built using accurate Southern Africa contextual data, legislation, and case
              studies. They're designed to simulate conversations with seasoned local mentors.
            </p>
            
            <p className="text-base sm:text-lg md:text-xl leading-normal sm:leading-relaxed font-semibold mt-4 sm:mt-6">
              Start your conversation now!
            </p>
          </div>
        </div>

        {/* Expert Cards Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            Choose your expert below!
          </h2>
          
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl mx-auto">
            {experts.slice(0, 3).map((expert, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer p-6"
                onClick={() => handleChatClick(expert.name)}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-28 h-28 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {expert.name}
                  </h3>
                  <div className="text-center w-full">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Areas of expertise include:</p>
                    <ul className="space-y-1">
                      {expert.areas.map((area, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[540px] mx-auto">
            {experts.slice(3, 5).map((expert, index) => (
              <div
                key={index + 3}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer p-6"
                onClick={() => handleChatClick(expert.name)}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-28 h-28 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {expert.name}
                  </h3>
                  <div className="text-center w-full">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Areas of expertise include:</p>
                    <ul className="space-y-1">
                      {expert.areas.map((area, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chat History Section */}
        {!historyLoading && recentSessions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Recent Conversations</h2>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
              >
                View All History
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSessions.slice(0, 3).map((session) => (
                <div
                  key={session.session_id}
                  onClick={() => handleContinueConversation(session)}
                  className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {getCollectionDisplayName(session.collection_name)}
                    </h3>
                    <span className="text-xs text-gray-500">{formatDate(session.last_activity)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    {session.message_count} message{session.message_count !== 1 ? 's' : ''}
                  </p>
                  {session.messages && session.messages[0] && (
                    <p className="text-xs text-gray-700 line-clamp-2 italic">
                      "{session.messages[0].query || session.messages[0].answer}"
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-blue-600 font-medium">Click to continue →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-2">
            Learn how to get the most out of your Mentormate experts{" "}
            <a href="#" className="text-[#1d78a3] underline hover:text-[#1d78a3]">here</a>
          </p>
          <p>
            <a href="#" className="text-[#1d78a3] underline hover:text-[#1d78a3]">Contact us</a>
          </p>
        </div>
      </div>

      {/* Chat History Modal */}
      <ChatHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
}