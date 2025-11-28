import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MamaDuduImg from "../assets/character3.png";
import { fetchWithAuth, startSessionMonitoring, handleSessionExpiration } from "../utils/sessionHandler";

const CHAT_HISTORY_KEY = "mamadudu_chat_history_v3";
const BACKEND_URL = "http://localhost:5000";

export default function MamaDuduChat() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userEmail") || "guest";
    const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Sanibonani! I'm Mama Dudu, a devoted advocate for clean water, climate resilience, and thriving ecosystems. My journey has taken me from grassroots wetlands restoration to national catchment management plans, always guided by the principle that nature and communities can flourish together. From the Vaal catchment to Tsitsikamma forest, I've led initiatives to safeguard our shared resources for generations to come. I bring a thoughtful approach grounded in science and sustainability. Let's engineer with care — the kind that listens, learns, and lasts.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(`session-${Date.now()}`);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentMentor = "Mama Dudu";
  const collectionName = "Water_docs";

  /* ==================== Session monitoring ==================== */
  useEffect(() => {
    const cleanup = startSessionMonitoring(navigate);
    return cleanup;
  }, [navigate]);

  /* ==================== Load conversation from history ==================== */
  useEffect(() => {
    if (location.state?.conversationId) {
      loadChatFromBackend(location.state.conversationId);
    }
  }, [location.state]);

  /* ==================== Auto-save chat history ==================== */
  useEffect(() => {
    const saveHistory = () => {
      if (messages.length <= 1) return; // only welcome message

      const allHistory = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || "{}");
      const mentorHistory = allHistory[currentMentor] || [];

      const firstUserMessage = messages.find((m) => m.type === "user");
      const currentSession = {
        id: currentSessionId,
        title: firstUserMessage
          ? firstUserMessage.content.slice(0, 50) +
            (firstUserMessage.content.length > 50 ? "..." : "")
          : "New Chat with Mama Dudu",
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

  /* ==================== Scroll to bottom ==================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ==================== Send message ==================== */
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
      streamAssistantMessage(
        assistantId,
        data.answer || "Sorry, I couldn't generate a response right now."
      );
    } catch (err) {
      console.error(err);
      
      // Don't show error message if session expired (user is being redirected)
      if (err.message === 'Session expired') {
        setIsTyping(false);
        return;
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: "assistant",
          content: "Connection error. Please check your network and try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
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

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ==================== Load / New Chat ==================== */
  const loadChat = (chatMessages, sessionId) => {
    setMessages(chatMessages);
    setCurrentSessionId(sessionId);
  };

  const startNewChat = () => {
    setMessages([messages[0]]);
    setCurrentConversationId(null);
    setCurrentSessionId(`session-${Date.now()}`);
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

  const newChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "assistant",
        content:
          "Sanibonani! I'm Mama Dudu, a devoted advocate for clean water, climate resilience, and thriving ecosystems. My journey has taken me from grassroots wetlands restoration to national catchment management plans, always guided by the principle that nature and communities can flourish together. From the Vaal catchment to Tsitsikamma forest, I've led initiatives to safeguard our shared resources for generations to come. I bring a thoughtful approach grounded in science and sustainability. Let's engineer with care — the kind that listens, learns, and lasts.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setCurrentSessionId(`session-${Date.now()}`);
  };

  const handleClearHistory = () => {
    window.location.reload();
  };

  return (
    <>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #999;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

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

        {/* Main Chat Area - fills all remaining space perfectly */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {/* Header */}
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
            <img
              src={MamaDuduImg}
              alt="Mama Dudu"
              className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-800 truncate">Mama Dudu</h1>
              <p className="text-xs text-gray-500 truncate">Environmental & Water Specialist</p>
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
          <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.type === "user" ? "justify-end" : "justify-start"} items-end gap-4`}
              >
                {m.type === "assistant" && (
                  <img
                    src={MamaDuduImg}
                    alt="Mama Dudu"
                    className="w-24 h-24 rounded-full shadow-lg flex-shrink-0"
                  />
                )}
                <div
                  className={`px-6 py-4 rounded-3xl max-w-4xl shadow-lg ${
                    m.type === "user"
                      ? "bg-gray-200 text-gray-900"
                      : m.id === "welcome"
                        ? "bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 text-gray-800 backdrop-blur-sm"
                        : "bg-[rgb(200,229,243)] text-gray-900"
                  }`}
                >
                  {m.id === "welcome" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                        <h3 className="font-semibold text-lg text-cyan-900">Welcome Message</h3>
                      </div>
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: (m.content || "").replace(/\n/g, "<br/>"),
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (m.content || "").replace(/\n/g, "<br/>"),
                      }}
                      className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap"
                    />
                  )}
                  <div className="text-xs text-gray-500 mt-3 text-right opacity-80">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-4 text-gray-500 italic">
                <img src={MamaDuduImg} alt="Mama Dudu" className="w-11 h-11 rounded-full shadow-lg" />
                <div className="flex gap-1">
                  <span className="dot"></span>
                  <span className="dot delay-200"></span>
                  <span className="dot delay-400"></span>
                </div>
                <span className="text-sm">Mama Dudu is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Input */}
          <footer className="border-t bg-white p-5 shadow-2xl">
            <div className="flex gap-4 max-w-5xl mx-auto">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask Mama Dudu about water systems, climate resilience, wetlands..."
                className="flex-1 border border-gray-300 rounded-full px-6 py-4 resize-none focus:ring-4 focus:ring-[rgb(200,229,243)]/50 focus:border-transparent outline-none bg-gray-50 text-gray-800 placeholder-gray-400 text-sm lg:text-base transition-all"
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[rgb(200,229,243)] hover:bg-[rgb(180,210,230)] text-gray-800 px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
              >
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}