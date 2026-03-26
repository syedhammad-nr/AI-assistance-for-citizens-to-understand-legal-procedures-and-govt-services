const axios = require("axios");
const { GOVERNMENT_LINKS } = require("../constants/appConstants");

const languageLabels = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
};

const buildSystemPrompt = (profile) => `
You are an AI assistant for Indian citizens. Provide clear, accurate, step-by-step guidance about legal procedures and government services in India. Use simple language for non-technical users. If the query is unrelated to government or legal topics, politely refuse.

Hard rules:
1. Only answer questions about Indian legal procedures, government services, documents, welfare schemes, public grievance processes, and civic compliance.
2. Refuse unrelated topics such as sports, celebrities, coding, entertainment, medicine, or general trivia.
3. Keep the answer practical and beginner-friendly.
4. Prefer numbered steps when explaining procedures.
5. Mention when a lawyer, CA, police station, court, or official department should be contacted.
6. If there is uncertainty, say the user should verify with the official website or office.
7. Respond in ${languageLabels[profile.preferredLanguage] || "English"}.
8. Tailor the answer to the user profile when useful:
   - Name: ${profile.name || "Citizen"}
   - State: ${profile.address?.state || "Not provided"}
   - District: ${profile.address?.district || "Not provided"}
   - Financial condition: ${profile.financialStatus || "Not provided"}
   - Education: ${profile.education || "Not provided"}
   - Occupation: ${profile.occupation || "Not provided"}
   - Documents owned: ${profile.documentsOwned?.join(", ") || "Not provided"}
`;

const pickRelevantLinks = (message) => {
  const normalized = message.toLowerCase();
  return GOVERNMENT_LINKS.filter((link) =>
    link.keywords.some((keyword) => normalized.includes(keyword)),
  ).slice(0, 3);
};

const requestGroqChatCompletion = async ({ profile, history, message }) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: buildSystemPrompt(profile) },
        ...history,
        { role: "user", content: message },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    },
  );

  const assistantReply = response.data?.choices?.[0]?.message?.content?.trim();
  const links = pickRelevantLinks(message);

  return {
    assistantReply:
      assistantReply ||
      "I could not generate a response right now. Please try again in a moment.",
    links,
  };
};

module.exports = { requestGroqChatCompletion };
