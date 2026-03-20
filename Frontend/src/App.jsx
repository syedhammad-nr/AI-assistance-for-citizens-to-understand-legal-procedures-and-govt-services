import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>⚖️ NyayaAI</h1>
      <p>Your AI legal assistant</p>

      <input
        type="text"
        placeholder="Ask your legal question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={sendMessage}>Ask</button>

      <p>{response}</p>
    </div>
  );
}

export default App;