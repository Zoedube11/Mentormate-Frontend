import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import SisNandiImg from "../assets/character5.png";

export default function SisNandiChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content:
        "I’m Sis Nandi — sharp in the lab, steady underground, and fearless in the face of complexity. I’ve worked across the full mine-to-metal value chain, from ore characterization and beneficiation to smelting, leaching, and electrorefining. Whether it’s flotation circuits or furnace design, I know how to read a process flow diagram and balance the numbers that matter. I'm a proud steward of the earth’s mineral wealth and a relentless voice for safety. I don’t sugarcoat risks, but I always chart a way forward.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  
  const collectionName = "Mining_docs";

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

    
    const endpoint = "https://oompiet.space/rag";
    const conversationId = sessionStorage.getItem("conversation_id");

    const requestBody = {
      query: txt,
      top_k: 5,
      max_tokens: 4096,
      collection_name: collectionName,
      user_id: "sis-nandi-test-user-001",
    };

    console.log("Sis Nandi RAG request body:", JSON.stringify(requestBody, null, 2));

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("API returned error:", text);
        throw new Error(`API request failed: ${text}`);
      }

      const data = await resp.json();
      console.log("RAG API response:", data);

      
      if (data.conversation_id)
        sessionStorage.setItem("conversation_id", data.conversation_id);

      
      streamAssistantMessage(
        assistantId,
        data.answer || "Sorry, no answer available at the moment."
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: "assistant",
          content: "Unable to reach RAG server.",
        },
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
        if (idx >= 0) {
          newMessages[idx].content = fullText.slice(0, i + 1);
        }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 flex justify-center">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b flex items-center gap-3">
            <img
              src={SisNandiImg}
              alt="Sis Nandi"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">Sis Nandi</h2>
              <div className="text-sm text-gray-500">
                Mining & metallurgical specialist
              </div>
            </div>
            <div className="ml-auto text-sm text-gray-400 font-bold">SN</div>
          </div>

      
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end ${
                  m.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.type === "assistant" && (
                  <img
                    src={SisNandiImg}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`${
                    m.type === "user"
                      ? "bg-gray-200 text-gray-900"
                      : "bg-purple-50 text-gray-900"
                  } rounded-2xl px-4 py-2 max-w-[70%] shadow-md animate-fade-in`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: (m.content || "").replace(/\n/g, "<br/>"),
                    }}
                  />
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 italic">
                <img
                  src={SisNandiImg}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex gap-1">
                  <span className="dot animate-bounce"></span>
                  <span className="dot animate-bounce delay-200"></span>
                  <span className="dot animate-bounce delay-400"></span>
                </div>
                <span>Sis Nandi is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

    
          <div className="p-4 border-t flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Sis Nandi about ore processing, circuits, or safety..."
              className="flex-1 border rounded-full px-4 py-2 resize-none focus:ring-2 focus:ring-purple-400"
              rows={1}
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .dot { width: 6px; height: 6px; background-color: #a78bfa; border-radius: 50%; display: inline-block; }
        .animate-bounce { animation: bounce 0.6s infinite; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
    </div>
  );
}

