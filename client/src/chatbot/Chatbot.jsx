
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, MessageCircle, X, Minus } from "lucide-react";
import { getChatResponse } from "../api/openai"; 
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "👋 Welcome! I'm your AI assistant. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = input.trim();
  setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
  setInput("");
  setIsTyping(true); 

  try {
    const botResponse = await getChatResponse(userMessage);
    setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
  } catch (error) {
    setMessages((prev) => [...prev, { text: "Sorry, something went wrong.", sender: "bot" }]);
  } finally {
    setIsTyping(false); // End typing animation
  }  
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);
  const minimizeChat = () => setIsMinimized(true);
  const maximizeChat = () => setIsMinimized(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <button
            onClick={toggleChat}
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          </button>
          <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
              Chatbot AI
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #4f46e5, #db2777);
        }
      `}</style>

      <div
        className={`bg-gray-900 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)] overflow-hidden transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 flex-1"
              onClick={isMinimized ? maximizeChat : undefined}
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Chatbot AI</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-white/80">Online now</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized && (
                <button
                  onClick={minimizeChat}
                  className="w-6 h-6 hover:bg-white/20 rounded-md flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={toggleChat}
                className="w-6 h-6 hover:bg-white/20 rounded-md flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-gray-800 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${
                    msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-700"
                        : "bg-gradient-to-r from-pink-500 to-pink-700"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-br-md"
                        : "bg-gray-700 text-gray-100 shadow-sm rounded-bl-md"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              
              ))}
              {isTyping && (
  <div className="flex items-start space-x-2">
    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-700">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-gray-700 text-gray-100 px-3 py-2 rounded-2xl text-sm flex space-x-1">
  <span className="animate-bounce">.</span>
  <span className="animate-bounce delay-100">.</span>
  <span className="animate-bounce delay-200">.</span>
</div>
  </div>
)}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-900">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none placeholder-gray-400"
                    style={{ minHeight: "36px", maxHeight: "80px" }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

