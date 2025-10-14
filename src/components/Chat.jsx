import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/Authentication"; // If not using Auth yet, comment this line

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hallo daar! Ek's Piet, a seasoned geotechnical engineer with deep roots in tailings, geology, and soil mechanics. I've been shaping South Africa's mining and infrastructure landscape since the days of the first gold rush. Whether it's monitoring tailings storage facilities, overseeing complex site investigations or stabilising a sinkhole-prone site, I bring a practical mindset and a steady hand earned through years on the ground. Ask away, and I'll help you build with confidence—from the first soil sample to final installation.",
      time: "12:00 PM",
      avatar: "OP",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { user: authUser, logout } = useAuth() || {};

  useEffect(() => {
    if (authUser) setUser(authUser);
    scrollToBottom();
  }, [messages, authUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    return nameParts.length === 1
      ? nameParts[0].substring(0, 2).toUpperCase()
      : (nameParts[0].charAt(0) + nameParts[1]?.charAt(0)).toUpperCase();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: getUserInitials(user?.name),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const loadingMessage = {
      id: `loading-${Date.now()}`,
      type: "loading",
      content: "Thinking...",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "OP",
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch("https://oompiet.space/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          top_k: 5,
          max_tokens: 4096,
          collection_name: "Tailings_engineer_docs",
          user_id: user?.email || "demo-user",
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: data.answer,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "OP",
        feedbackSubmitted: false,
      };

      setMessages((prev) =>
        prev.filter((m) => m.id !== loadingMessage.id).concat(assistantMessage)
      );
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: "error",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "OP",
      };
      setMessages((prev) =>
        prev.filter((m) => m.id !== loadingMessage.id).concat(errorMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = async (messageId, isPositive) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedbackSubmitted: true, isPositive }
          : msg
      )
    );

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, isPositive }),
      });
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/static/logo.png" alt="Logo" className="h-16 mr-2" />
          <span className="text-2xl font-bold text-orange-700 font-pabasing">
            mentormate
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={user.picture || "/static/default-profile.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-orange-500"
                />
              </button>
              {showProfileDropdown && (
                <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg min-w-[200px] border">
                  <div className="p-4 border-b">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
            >
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Chat Section */}
      <div className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-sm overflow-hidden relative">
          {/* Mentor Avatar */}
          <div className="absolute right-4 top-4 z-10 w-32 text-center">
            <img
              src="/static/geo-engineer-character.jpg"
              alt="Oom Piet"
              className="w-full rounded-full"
            />
            <div className="mt-2 text-sm text-gray-600 bg-white rounded-full px-2 py-1 shadow-sm font-pabasing">
              Oom Piet
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 pr-16 pt-20 overflow-y-auto max-h-[60vh] space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user"
                    ? "justify-end"
                    : "items-start"
                } gap-4`}
              >
                <div
                  className={`flex flex-col ${
                    message.type === "user"
                      ? "items-end"
                      : message.type === "error"
                      ? "items-start"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === "user"
                        ? "bg-gray-200 text-gray-800"
                        : message.type === "error"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-orange-50 text-gray-800"
                    }`}
                  >
                    {message.type === "loading" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 0.3}s` }}
                            />
                          ))}
                        </div>
                        <span>{message.content}</span>
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.content.replace(/\n/g, "<br>"),
                        }}
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {message.time}
                  </div>

                  {/* Feedback */}
                  {message.type === "assistant" && !message.feedbackSubmitted && (
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="italic">Help us improve:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFeedback(message.id, true)}
                          className="p-1 hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                          title="Helpful"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, false)}
                          className="p-1 hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                          title="Not helpful"
                        >
                          👎
                        </button>
                      </div>
                    </div>
                  )}
                  {message.feedbackSubmitted && (
                    <span className="text-green-600 italic text-sm mt-1">
                      Thank you for your feedback!
                    </span>
                  )}
                </div>
                {message.type !== "user" && (
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold flex-shrink-0">
                    {message.avatar}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-end gap-4">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 p-3 border border-gray-300 rounded-full resize-none min-h-[48px] max-h-[120px] overflow-y-auto focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                disabled={isLoading}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
