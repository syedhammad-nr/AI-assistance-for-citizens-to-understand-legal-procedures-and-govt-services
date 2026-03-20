const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", // FREE + FAST
        messages: [
          {
            role: "system",
            content:
              "You are a legal assistant for Indian citizens. Explain everything in simple step-by-step format."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SUCCESS:", response.data);

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    res.json({
      reply: "Error getting response from AI"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});