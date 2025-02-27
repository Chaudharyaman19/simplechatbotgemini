import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import "./index.css";
import axios from "axios";

function App() {
  const API_KEY = "AIzaSyBQzspnMDzSSZjtzNV44tjS5TyBgBdoGr8";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: input,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const modelRes =
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0];
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text: modelRes.text || "I'd love to help you with that!",
        },
      ]);
    }, 1);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-icon">
          <i className="fas fa-user-plus"></i>
        </div>
        <div className="active-dot"></div>
        <div className="header-icon">
          <i className="fas fa-times"></i>
        </div>
      </header>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <footer className="chat-footer">
        <input
          type="text"
          value={input}
          placeholder="Type Your Message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}

export default App;
