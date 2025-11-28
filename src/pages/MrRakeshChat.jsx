import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Sidebar with history
import MrRakeshImg from "../assets/character4.png";
import { fetchWithAuth, startSessionMonitoring } from "../utils/sessionHandler";

const CHAT_HISTORY_KEY = "mamadudu_chat_history_v3";
const BACKEND_URL = "http://localhost:5000";

export default function MrRakeshChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userEmail") || "guest";
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello and welcome—I'm Mr. Rakesh. I work at the intersection of power, possibility, and precision. Whether it's utility-scale generation or rooftop renewables, I help design and integrate energy systems that are safe, efficient, and future-ready. My experience spans transmission networks, embedded generation, energy storage, and smart technologies, always guided by a deep respect for standards, safety, and sustainability. I believe in calm leadership, clear communication, and engineering that empowers.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentMentor, setCurrentMentor] = useState("Mr. Rakesh");
  const [currentSessionId, setCurrentSessionId] = useState(`session-${Date.now()}`);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const collectionName = "Electrical_docs";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ========== SESSION MONITORING ========== */
  useEffect(() => {
    const cleanup = startSessionMonitoring(navigate);
    return cleanup;
  }, [navigate]);

  /* ========== LOAD CONVERSATION FROM HISTORY ========== */
  useEffect(() => {
    if (location.state?.conversationId) {
      loadChatFromBackend(location.state.conversationId);
    }
  }, [location.state]);

  /* ========== CHAT HISTORY LIKE BRA VUSI ========== */
  useEffect(() => {
    const saveHistory = () => {
      if (messages.length <= 1) return;
      const allHistory = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || "{}");
      const mentorHistory = allHistory[currentMentor] || [];

      const firstUserMessage = messages.find((m) => m.type === "user");
      const currentSession = {
        id: currentSessionId,
        title: firstUserMessage
          ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
          : "New Chat with Mr. Rakesh",
        timestamp: new Date().toLocaleString("en-ZA", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        messages,
      };

      const existingIndex = mentorHistory.findIndex((s) => s.id === currentSessionId);
      let updated;
      if (existingIndex !== -1) {
        updated = [...mentorHistory];
        updated[existingIndex] = currentSession;
      } else {
        updated = [currentSession, ...mentorHistory].slice(0, 15);
      }

      localStorage.setItem(
        CHAT_HISTORY_KEY,
        JSON.stringify({ ...allHistory, [currentMentor]: updated })
      );
    };

    const interval = setInterval(saveHistory, 5000);
    saveHistory();
    return () => clearInterval(interval);
  }, [messages, currentMentor, currentSessionId]);

  /* ========== AUTO SCROLL ========== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ========== SEND MESSAGE ========== */
  const sendMessage = async () => {
    const txt = inputValue.trim();
    if (!txt) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      type: "user",
      content: txt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, type: "assistant", content: "", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);

    try {
      // Generate conversation_id if this is a new conversation
      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = `conv_${userId}_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
        setCurrentConversationId(conversationId);
      }

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

      const data = await resp.json();
      streamAssistantMessage(assistantId, data.answer || "Sorry, no answer available at the moment.");
    } catch (err) {
      // Don't show error if session expired (user is being redirected)
      if (err.message === 'Session expired') {
        setIsTyping(false);
        return;
      }
      
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, type: "assistant", content: "Unable to reach RAG server." },
      ]);
      setIsTyping(false);
    }
  };

  const streamAssistantMessage = (messageId, fullText) => {
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const idx = newMessages.findIndex((m) => m.id === messageId);
        if (idx >= 0) newMessages[idx].content = fullText.slice(0, i + 1);
        return newMessages;
      });
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ========== CHAT HISTORY FUNCTIONS ========== */
  const startNewChat = () => {
    setMessages([messages[0]]);
    setCurrentSessionId(`session-${Date.now()}`);
    setCurrentConversationId(null);
  };

  const loadChat = (chatMessages, sessionId) => {
    setMessages(chatMessages);
    setCurrentSessionId(sessionId);
  };

  const loadChatFromBackend = async (conversationId) => {
    try {
      const resp = await fetchWithAuth(
        `${BACKEND_URL}/chat_history/${userId}/session/${conversationId}`,
        {},
        navigate
      );
      
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

      const data = await resp.json();
      
      if (data.messages && data.messages.length > 0) {
        const loadedMessages = [messages[0]];
        
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
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        }
      );
      
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

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
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar - fixed position */}
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
          onLoadChat={loadChatFromBackend}
          onStartNewChat={startNewChat}
          onClearHistory={clearHistory}
          currentConversationId={currentConversationId}
          collectionName={collectionName}
          backendUrl={BACKEND_URL}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>

      {/* Chat Layout */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b bg-white sticky top-0 z-10">
          <button
            onClick={() => window.location.href = '/mentormate-homepage'}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <img src={MrRakeshImg} alt="Mr Rakesh" className="w-12 h-12 rounded-full object-cover"/>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold truncate">Mr. Rakesh</h1>
            <p className="text-xs text-gray-500 truncate">Electrical & Energy Specialist</p>
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

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"} items-end gap-3`}>
              {m.type === "assistant" && (
                <img src={MrRakeshImg} alt="avatar" className="w-24 h-24 rounded-full shadow-sm" />
              )}
              <div
                className={`${
                  m.type === "user" 
                    ? "bg-gray-200 text-gray-900" 
                    : m.id === "welcome" 
                      ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-gray-800" 
                      : "bg-[rgb(155,202,233)] text-gray-900"
                } px-5 py-4 rounded-2xl max-w-4xl shadow-lg ${
                  m.id === "welcome" ? "backdrop-blur-sm" : ""
                }`}
              >
                {m.id === "welcome" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="font-semibold text-lg text-blue-900">Welcome Message</h3>
                    </div>
                    <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: (m.content || "").replace(/\n/g, "<br/>") }} />
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: (m.content || "").replace(/\n/g, "<br/>") }} />
                )}
                <div className="text-xs text-gray-500 mt-2 text-right">{m.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex gap-1.5">
                <span className="dot animate-bounce"></span>
                <span className="dot animate-bounce delay-200"></span>
                <span className="dot animate-bounce delay-400"></span>
              </div>
              <span className="text-sm italic">Mr Rakesh is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="border-t p-4 bg-white flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about power, grid integration, or renewables..."
            className="flex-1 border rounded-full px-4 py-2 resize-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-sm lg:text-base"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[rgb(87,154,198)] text-white px-6 py-2 rounded-full hover:bg-[rgb(81,123,151)] disabled:opacity-50"
          >
            Send
          </button>
        </footer>

        {/* Typing Animation */}
        <style>{`
          .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
          .animate-bounce { animation: bounce 0.6s infinite; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-400 { animation-delay: 0.4s; }
          @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        `}</style>
      </div>
    </div>
  );
}

