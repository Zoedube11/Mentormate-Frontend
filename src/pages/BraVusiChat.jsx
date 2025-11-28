import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BraVusiImg from "../assets/character2.png";
import { fetchWithAuth, startSessionMonitoring } from "../utils/sessionHandler";

// Map mentor names to collection names - UPDATE THESE TO MATCH YOUR BACKEND
const MENTOR_COLLECTIONS = {
  "Bra Vusi": "Concrete_docs",
  "Mama Dudu": "MamaDudu_collection", // Update these
  "Oom Piet": "OomPiet_collection",
  "Mr Rakesh": "MrRakesh_collection",
  "Sis Nandi": "SisNandi_collection"
};

// IMPORTANT: Set your backend URL here
const BACKEND_URL = "http://localhost:5000" // Change this to your backend URL

export default function BraVusiChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentMentor = "Bra Vusi";
  const collectionName = MENTOR_COLLECTIONS[currentMentor];
  
  // Get actual logged-in user email from localStorage
  const userId = localStorage.getItem("userEmail") || "guest";

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Howzit! I'm Bra Vusi, your go-to structural fundi. I kicked off my journey as a batch plant operator, mastering the perfect mix and getting my hands dirty with hardcore site operations. Over time, I shifted gears into structural designs, turning blueprints into buildings and bridges. From Jozi's skyline to national highways, I've tackled shaky foundations, tight timelines, and every curveball the site could throw. Let's build it strong, safe, and sound together.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ========== SESSION MONITORING ========== */
  useEffect(() => {
    const cleanup = startSessionMonitoring(navigate);
    return cleanup;
  }, [navigate]);

  /* ========== LOAD CONVERSATION FROM HISTORY ========== */
  useEffect(() => {
    if (location.state?.conversationId) {
      loadChat(location.state.conversationId);
    }
  }, [location.state]);

  /* ========== AUTO SCROLL ========== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ========== SEND MESSAGE WITH BACKEND ========== */
  const sendMessage = async () => {
    const txt = inputValue.trim();
    if (!txt) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      type: "user",
      content: txt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        type: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    try {
      // Generate conversation_id if this is a new conversation
      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = `conv_${userId}_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
        setCurrentConversationId(conversationId);
      }

      // Use the direct /rag endpoint (not /api/rag since that requires authentication)
      const resp = await fetchWithAuth(
        `${BACKEND_URL}/api/rag`,
        {
          method: "POST",
          body: JSON.stringify({
            query: txt,
            top_k: 5,
            max_tokens: 4096,
            collection_name: collectionName,
            user_id: userId,
            conversation_id: conversationId,
          }),
        },
        navigate
      );

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();

      streamAssistantMessage(
        assistantId,
        data.answer || "Sorry, couldn't generate a response right now."
      );
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Don't show error if session expired (user is being redirected)
      if (error.message === 'Session expired') {
        setIsTyping(false);
        return;
      }
      
      setMessages((prev) => 
        prev.map(m => 
          m.id === assistantId 
            ? { ...m, content: "Unable to reach server. Please try again." }
            : m
        )
      );
      setIsTyping(false);
    }
  };

  const streamAssistantMessage = (messageId, fullText) => {
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const msg = updated.find((m) => m.id === messageId);
        if (msg) msg.content = fullText.slice(0, i + 1);
        return updated;
      });
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  const startNewChat = () => {
    setMessages([messages[0]]); // Keep welcome message
    setCurrentConversationId(null); // Reset conversation ID
  };

  const loadChat = async (conversationId) => {
    try {
      // Fetch specific session from backend
      const resp = await fetchWithAuth(
        `${BACKEND_URL}/chat_history/${userId}/session/${conversationId}`,
        {},
        navigate
      );
      
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      
      if (data.messages && data.messages.length > 0) {
        // Convert backend messages to frontend format
        const loadedMessages = [messages[0]]; // Keep welcome message
        
        data.messages.forEach((msg) => {
          if (msg.role === "user" && msg.query) {
            loadedMessages.push({
              id: `u-${Date.now()}-${Math.random()}`,
              type: "user",
              content: msg.query,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
          if (msg.role === "assistant" && msg.answer) {
            loadedMessages.push({
              id: `a-${Date.now()}-${Math.random()}`,
              type: "assistant",
              content: msg.answer,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
        });
        
        setMessages(loadedMessages);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      alert("Failed to load chat history. Please try again.");
    }
  };

  const clearHistory = async () => {
    try {
      const resp = await fetch(
        `${BACKEND_URL}/chat_history/${userId}/delete?collection_name=${encodeURIComponent(collectionName)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        }
      );
      
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      
      if (data.status === "success") {
        startNewChat();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  };

  return (
    <>
      {/* Typing animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .dot { width: 8px; height: 8px; background: #999; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <div className="fixed left-0 top-0 h-full z-20">
          <Sidebar
            currentMentor={currentMentor}
            userId={userId}
            onSelectMentor={(mentorName) => {
              const routes = {
                "Mama Dudu": "/chat_mama_dudu",
                "Oom Piet": "/chat_oom_piet",
                "Bra Vusi": "/chat_bra_vusi",
                "Mr Rakesh": "/chat_mr_rakesh",
                "Sis Nandi": "/chat_sis_nandi"
              };
              const route = routes[mentorName];
              if (route) navigate(route);
            }}
            onLoadChat={loadChat}
            onStartNewChat={startNewChat}
            onClearHistory={clearHistory}
            currentConversationId={currentConversationId}
            collectionName={collectionName}
            backendUrl={BACKEND_URL}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
        </div>

        <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <header className="flex items-center gap-5 px-6 py-5 bg-white border-b sticky top-0 z-10 shadow-sm">
            <button
              onClick={() => window.location.href = '/mentormate-homepage'}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Back to Home"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <img src={BraVusiImg} alt="Bra Vusi" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold truncate">Bra Vusi</h1>
              <p className="text-xs text-gray-500 truncate">Concrete & Structural Specialist</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"} items-end gap-4`}>
                {m.type === "assistant" && (
                  <img src={BraVusiImg} alt="avatar" className="w-24 h-24 rounded-full shadow-lg" />
                )}
                <div className={`px-6 py-4 rounded-3xl max-w-4xl shadow-lg ${
                  m.type === "user" 
                    ? "bg-gray-200 text-gray-900" 
                    : m.id === "welcome" 
                      ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 text-gray-800 backdrop-blur-sm" 
                      : "bg-[rgb(200,229,243)] text-gray-900"
                }`}>
                  {m.id === "welcome" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                        <h3 className="font-semibold text-lg text-emerald-900">Welcome Message</h3>
                      </div>
                      <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, "<br/>") }} />
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, "<br/>") }} className="text-sm lg:text-base leading-relaxed" />
                  )}
                  <div className="text-xs text-gray-500 mt-3 text-right">{m.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-4">
                <img src={BraVusiImg} alt="avatar" className="w-11 h-11 rounded-full shadow-lg" />
                <div className="flex gap-1">
                  <span className="dot"></span>
                  <span className="dot delay-200"></span>
                  <span className="dot delay-400"></span>
                </div>
                <span className="text-sm">Bra Vusi is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          <footer className="border-t bg-white p-5 shadow-2xl">
            <div className="flex gap-4 max-w-5xl mx-auto">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Ask Bra Vusi about concrete strength, beam design, reinforcement..."
                className="flex-1 border border-gray-300 rounded-full px-6 py-4 resize-none focus:ring-4 focus:ring-[rgb(200,229,243)]/50 text-sm lg:text-base"
              />
              <button onClick={sendMessage} disabled={!inputValue.trim() || isTyping}
                className="bg-[rgb(200,229,243)] px-8 py-4 rounded-full font-semibold hover:bg-[rgb(180,210,230)] disabled:opacity-50">
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}






