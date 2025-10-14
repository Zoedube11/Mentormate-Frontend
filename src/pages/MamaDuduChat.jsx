import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MamaDuduImg from "../assets/character3.png";

export default function MamaDuduChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "assistant",
      content: " Sanibonani! I’m Mama Dudu, a devoted advocate for clean water, climate resilience, and thriving ecosystems. My journey has taken me from grassroots wetlands restoration to national catchment management plans, always guided by the principle that nature and communities can flourish together. From the Vaal catchment to Tsitsikamma forest, I’ve led initiatives to safeguard our shared resources for generations to come. I bring a thoughtful approach grounded in science and sustainability. Let’s engineer with care — the kind that listens, learns, and lasts.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const RAG_API = "https://oompiet.space/rag";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const txt = inputValue.trim();
    if (!txt) return;
    const userMsg = { id: `u-${Date.now()}`, type: "user", content: txt, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const resp = await fetch(RAG_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: txt, top_k: 5, collection_name: "Water_docs" })
      });
      const data = await resp.json();
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          type: "assistant",
          content: data.answer || "I couldn't find an answer.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, type: "assistant", content: "Error contacting server." }]);
    } finally {
      setIsTyping(false);
    }
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
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <img src={MamaDuduImg} alt="Mama Dudu" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="text-lg font-semibold">Mama Dudu</h2>
              <div className="text-sm text-gray-500">Water & environmental specialist</div>
            </div>
            <div className="ml-auto text-sm text-gray-400 font-bold">MD</div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end ${m.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.type === "assistant" && (
                  <img src={MamaDuduImg} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
                )}
                <div
                  className={`${
                    m.type === "user"
                      ? "bg-gray-200 text-gray-900"
                      : "bg-teal-50 text-gray-900"
                  } rounded-2xl px-4 py-2 max-w-[70%] shadow-md animate-fade-in`}
                >
                  <div dangerouslySetInnerHTML={{ __html: (m.content || "").replace(/\n/g, "<br/>") }} />
                  <div className="text-xs text-gray-400 mt-1 text-right">{m.timestamp}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 italic">
                <img src={MamaDuduImg} alt="avatar" className="w-6 h-6 rounded-full" />
                <div className="flex gap-1">
                  <span className="dot animate-bounce"></span>
                  <span className="dot animate-bounce delay-200"></span>
                  <span className="dot animate-bounce delay-400"></span>
                </div>
                <span>Sis is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about wetlands, catchments, or sustainability..."
              className="flex-1 border rounded-full px-4 py-2 resize-none focus:ring-2 focus:ring-teal-400"
              rows={1}
            />
            <button
              onClick={sendMessage}
              className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-500 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.3s ease-in; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          .dot { width: 6px; height: 6px; background-color: #5bc0eb; border-radius: 50%; display: inline-block; }
          .animate-bounce { animation: bounce 0.6s infinite; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-400 { animation-delay: 0.4s; }
          @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        `}
      </style>
    </div>
  );
}
