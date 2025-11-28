import { useState, useEffect } from "react";
import {
  FaBars,
  FaUser,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaTimes,
} from "react-icons/fa";
import MamaDuduImg from "../assets/character3.png";
import OomPietImg from "../assets/character.png";
import BraVusiImg from "../assets/character2.png";
import MrRakeshImg from "../assets/character4.png";
import SisNandiImg from "../assets/character5.png";

export default function Sidebar({
  currentMentor,
  userId,
  onSelectMentor,
  onLoadChat,
  onStartNewChat,
  onClearHistory,
  currentConversationId,
  collectionName,
  backendUrl,
  isOpen,
  setIsOpen,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use parent's isOpen state if provided (for mobile), otherwise use local state (for desktop)
  const sidebarOpen = isOpen !== undefined ? isOpen : isSidebarOpen;
  const setSidebarOpen = setIsOpen || setIsSidebarOpen;
  const [showMentors, setShowMentors] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const mentors = [
    { name: "Mama Dudu", image: MamaDuduImg },
    { name: "Oom Piet", image: OomPietImg },
    { name: "Bra Vusi", image: BraVusiImg },
    { name: "Mr Rakesh", image: MrRakeshImg },
    { name: "Sis Nandi", image: SisNandiImg },
  ];

  // Fetch chat history from backend when history panel is opened
  useEffect(() => {
    if (showHistory && userId && collectionName) {
      fetchChatHistory();
    }
  }, [showHistory, userId, collectionName]);

  const fetchChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // Use the direct /chat_history endpoint (not /api/rag/sessions)
      const params = new URLSearchParams({
        collection_name: collectionName,
        limit: "15",
      });

      const resp = await fetch(
        `${backendUrl}/chat_history/${userId}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();

      if (data.session && Array.isArray(data.session)) {
        // Transform backend sessions to frontend format
        const formattedSessions = data.session.map((session) => {
          // Get first user message for title
          const firstUserMsg = session.messages.find((m) => m.query);
          const title = firstUserMsg
            ? firstUserMsg.query.slice(0, 50) +
              (firstUserMsg.query.length > 50 ? "..." : "")
            : "Conversation";

          return {
            id: session.session_id,
            title: title,
            timestamp: new Date(session.last_activity).toLocaleString("en-ZA", {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
            messageCount: session.message_count,
          };
        });

        setChatHistory(formattedSessions);
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleClearHistory = async () => {
    if (
      window.confirm(
        `Clear all ${currentMentor} chat history? This cannot be undone.`
      )
    ) {
      if (onClearHistory) {
        const success = await onClearHistory();
        if (success) {
          setChatHistory([]);
        }
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col z-50
          ${sidebarOpen ? "left-0 w-64" : "-left-64 w-20"} lg:left-0 lg:${sidebarOpen ? "w-64" : "w-20"}
        `}
      >
        {/* Header - Only show on desktop or when sidebar is open on mobile */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all lg:block hidden"
          >
            {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
          {sidebarOpen && <span className="font-bold text-lg">MentorMate</span>}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all lg:hidden"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {/* Dashboard */}
          <button
            onClick={() => !sidebarOpen && setSidebarOpen(true)}
            className={`w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-100 transition-all ${
              sidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <FaTachometerAlt className="text-xl" />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>

          {/* Mentors Dropdown */}
          <div>
            <button
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarOpen(true);
                  setShowMentors(true);
                } else {
                  setShowMentors(!showMentors);
                }
              }}
              className={`w-full flex items-center ${
                sidebarOpen ? "justify-between px-6" : "justify-center"
              } py-3 hover:bg-gray-100 transition-all`}
            >
              <div className="flex items-center gap-4">
                <FaUser className="text-xl" />
                {sidebarOpen && <span className="font-medium">Mentors</span>}
              </div>
              {sidebarOpen && (showMentors ? <FaChevronUp /> : <FaChevronDown />)}
            </button>

            {showMentors && sidebarOpen && (
              <div className="mt-2 space-y-2 px-6">
                {mentors.map((mentor) => (
                  <button
                    key={mentor.name}
                    onClick={() => {
                      onSelectMentor(mentor.name);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      currentMentor === mentor.name
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    />
                    <span className="font-medium">{mentor.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat History */}
          <div className="mt-4">
            <button
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarOpen(true);
                  setShowHistory(true);
                } else {
                  setShowHistory(!showHistory);
                }
              }}
              className={`w-full flex items-center ${
                sidebarOpen ? "justify-between px-6" : "justify-center"
              } py-3 hover:bg-gray-100 transition-all`}
            >
              <div className="flex items-center gap-4">
                <FaHistory className="text-xl" />
                {sidebarOpen && <span className="font-medium">Chat History</span>}
              </div>
              {sidebarOpen && (showHistory ? <FaChevronUp /> : <FaChevronDown />)}
            </button>

            {showHistory && sidebarOpen && (
              <div className="mx-4 mt-2 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-[rgb(200,229,243)] p-3 text-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{currentMentor}</h4>
                    <p className="text-xs opacity-75">Conversations</p>
                  </div>
                  <button
                    onClick={() => {
                      onStartNewChat?.();
                      setShowHistory(false);
                    }}
                    className="bg-white/40 hover:bg-white/60 rounded-lg px-2 py-1 text-xs font-medium"
                  >
                    + New
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {isLoadingHistory ? (
                    <div className="p-8 text-center text-gray-400">
                      <p className="text-sm">Loading history...</p>
                    </div>
                  ) : chatHistory.length > 0 ? (
                    chatHistory.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => {
                          onLoadChat(session.id);
                          setShowHistory(false);
                          setSidebarOpen(false);
                        }}
                        className={`px-4 py-3 hover:bg-[rgb(200,229,243)]/20 cursor-pointer border-b border-gray-100 transition-all ${
                          session.id === currentConversationId
                            ? "bg-[rgb(200,229,243)]/30"
                            : ""
                        }`}
                      >
                        <p className="font-medium text-gray-800 text-sm line-clamp-2">
                          {session.title}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{session.timestamp}</p>
                          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                            {session.messageCount} msgs
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs mt-1">Start chatting to see history</p>
                    </div>
                  )}
                </div>

                {chatHistory.length > 0 && (
                  <div className="p-3 border-t bg-white text-center">
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear History
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t text-center text-sm text-gray-500 font-medium">
            mentormate
          </div>
        )}
      </aside>
    </>
  );
}