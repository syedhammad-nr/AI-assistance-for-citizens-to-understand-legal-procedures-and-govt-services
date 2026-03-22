import { useState } from "react";
import "./App.css";

export default function App() {
  const [message, setMessage] = useState("");

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">⚖️ NyayaAI</div>
        <div className="header-actions">
          <button>🌐 Language</button>
          <button>❓ Help</button>
        </div>
      </header>

      <div className="main">

        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Quick Topics</h3>
          <button>🪪 Aadhaar / PAN</button>
          <button>👮 Police Complaint</button>
          <button>🏠 Property Issues</button>
          <button>📜 Govt Schemes</button>
          <button>⚖️ Court Process</button>
        </aside>

        {/* Chat Area */}
        <section className="chat-area">

          <div className="welcome">
            <h2>👋 Welcome to NyayaAI</h2>
            <p>
              Your AI assistant for legal procedures and government services.
              Ask any question — simple or complex.
            </p>
          </div>

          {/* Input */}
          <div className="input-area">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about legal procedures, complaints, schemes..."
            />
            <button>Send</button>
          </div>

        </section>
      </div>
    </div>
  );
}