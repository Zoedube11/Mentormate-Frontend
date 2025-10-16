import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MamaDuduImg from "../assets/character3.png";

export default function MamaDuduChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Sanibonani! I’m Mama Dudu, a devoted advocate for clean water, climate resilience, and thriving ecosystems. My journey has taken me from grassroots wetlands restoration to national catchment management plans, always guided by the principle that nature and communities can flourish together. From the Vaal catchment to Tsitsikamma forest, I’ve led initiatives to safeguard our shared resources for generations to come. I bring a thoughtful approach grounded in science and sustainability. Let’s engineer with care — the kind that listens, learns, and lasts.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const collectionName = "Water_docs";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
      {
        id: assistantId,
        type: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

  
    const endpoint = "https://oompiet.space/rag";
    const requestBody = {
      query: txt,
      top_k: 5,
      max_tokens: 4096,
      collection_name: collectionName,
      user_id: "mamadudu-test-user-001",
    };

    console.log("Mamadudu RAG request body:", JSON.stringify(requestBody, null, 2));

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`API request failed: ${text}`);
      }

      const data = await resp.json();
      console.log("RAG API response:", data);

      if (data.conversation_id) sessionStorage.setItem("conversation_id", data.conversation_id);

      streamAssistantMessage(assistantId, data.answer || "Sorry, no answer available at the moment.");
    } catch (err) {
      console.error(err);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-between p-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-4 overflow-y-auto h-[70vh]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`my-3 flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              {msg.type === "assistant" && (
                <img
                  src={MamaDuduImg}
                  alt="Mama Dudu"
                  className="w-10 h-10 rounded-full mr-2 flex-shrink-0"
                />
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                } prose prose-sm max-w-none assistant-message`}
              >
                {msg.type === "user" ? (
                  <>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs text-blue-200 mt-1 text-right">
                      {msg.timestamp}
                    </div>
                  </>
                ) : (
          
                  <>
                    <div
                      className="assistant-content"
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                    <div className="text-xs text-gray-500 mt-2 text-right">
                      {msg.timestamp}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-1 pl-12 my-3">
              <div className="dot animate-bounce"></div>
              <div className="dot animate-bounce delay-200"></div>
              <div className="dot animate-bounce delay-400"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="w-full max-w-3xl flex items-end mt-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim()}
            className="ml-3 bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[60px]"
          >
            Send
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dot {
          width: 6px;
          height: 6px;
          background-color: #5bc0eb;
          border-radius: 50%;
          display: inline-block;
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        /* Override API inline styles for better Tailwind integration */
        .assistant-content h5 {
          margin: 0.5rem 0 !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          line-height: 1.5 !important;
        }
        .assistant-content br {
          display: block;
          margin: 0.25rem 0 !important;
        }
        .assistant-content h5:first-child {
          margin-top: 0 !important;
        }
        .assistant-content ul,
        .assistant-content ol {
          padding-left: 1.25rem !important;
          margin: 0.5rem 0 !important;
        }
        .assistant-content li {
          margin: 0.25rem 0 !important;
        }
        .prose {
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .prose *:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
}