require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    console.log("API KEY:", process.env.GROQ_API_KEY);

    console.log("MODEL USED:", "llama-3.1-8b-instant");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are NyayaAI, a professional AI legal assistant for Indian citizens.

STRICT RULES:

1. Answer questions related to:
- Indian law
- Police systems
- Government services
- Legal procedures
- Rights and duties

2. If the question is unrelated (jokes, entertainment, celebrities), reply:
"I am designed to assist only with legal and government-related queries."

3. RESPONSE FORMAT RULES:

- If the question starts with "How to", "How do I", or asks for a procedure:
  → Respond in step-by-step format:

Step 1: ...
Step 2: ...
Step 3: ...

- If the question starts with "What is", "Explain", "Define":
  → Respond with a clear paragraph explanation (NO steps)

- If the question asks for differences:
  → Respond in comparison format

4. Keep language simple and easy for common citizens.

5. Be practical and relevant to India.

6. If unsure, say:
"I recommend consulting a legal professional for accurate guidance."
`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SUCCESS:", response.data);

    res.json({
      reply: response.data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);

    res.json({
      reply: "Error getting response from AI"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});