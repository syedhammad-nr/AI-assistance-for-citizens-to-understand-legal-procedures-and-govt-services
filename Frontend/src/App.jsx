import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      setChat([
        ...newChat,
        { role: "ai", text: data.reply }
      ]);

    } catch (error) {
      setChat([
        ...newChat,
        { role: "ai", text: "Error getting response" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚖️ NyayaAI</h1>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#4CAF50" : "#333"
            }}
          >
            {msg.text.split("\n").map((line, i) => (
  <div key={i}>{line}</div>
))}
          </div>
        ))}

        {loading && (
          <div style={styles.loading}>Thinking...</div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your legal question..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    marginTop: "20px"
  },
  chatBox: {
    width: "60%",
    height: "70%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    gap: "10px"
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%"
  },
  inputContainer: {
    display: "flex",
    width: "60%",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "none"
  },
  button: {
    padding: "10px 20px",
    marginLeft: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  loading: {
    color: "gray"
  }
};

export default App;