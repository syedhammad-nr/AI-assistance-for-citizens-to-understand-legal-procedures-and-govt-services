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

1. ONLY answer questions related to Indian law, legal procedures, and government services.

2. If the question is unrelated, reply EXACTLY:
"I am designed to assist only with legal and government-related queries."

3. RESPONSE FORMAT IS MANDATORY:

- Use ONLY bullet steps.
- Each step must be on a NEW LINE.
- Do NOT write paragraphs.

Format:

Step 1: ...
Step 2: ...
Step 3: ...
Step 4: ...

4. Keep sentences SHORT and CLEAR.

5. Avoid long explanations. No paragraphs.

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