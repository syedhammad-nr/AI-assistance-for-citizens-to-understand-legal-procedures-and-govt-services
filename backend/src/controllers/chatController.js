const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { addMessage, getMessagesByUserId } = require("../models/Conversation");
const { toSafeUser } = require("../models/User");
const { sanitizeString } = require("../utils/sanitize");
const { validateChatMessage } = require("../utils/validators");
const { isRelevantGovernmentQuery } = require("../utils/relevance");
const { requestGroqChatCompletion } = require("../services/groqService");

const chat = asyncHandler(async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    throw new ApiError(500, "Groq API key is not configured on the server.");
  }

  const message = sanitizeString(req.body.message);
  validateChatMessage(message);

  if (!isRelevantGovernmentQuery(message)) {
    const refusalReply =
      req.user.preferredLanguage === "hi"
        ? "मैं केवल भारतीय कानूनी प्रक्रियाओं और सरकारी सेवाओं से जुड़े सवालों में मदद कर सकता हूँ।"
        : req.user.preferredLanguage === "kn"
          ? "ನಾನು ಭಾರತದಲ್ಲಿನ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಹುದು."
          : "I can only help with Indian legal procedures and government service questions.";

    await addMessage({ userId: req.user.id, role: "user", content: message });
    await addMessage({ userId: req.user.id, role: "assistant", content: refusalReply });

    return res.json({
      reply: refusalReply,
      links: [],
      messages: await getMessagesByUserId(req.user.id),
    });
  }

  const history = (await getMessagesByUserId(req.user.id, 12)).map((entry) => ({
    role: entry.role,
    content: entry.content,
  }));

  const { assistantReply, links } = await requestGroqChatCompletion({
    profile: toSafeUser(req.user),
    history,
    message,
  });

  await addMessage({ userId: req.user.id, role: "user", content: message });
  await addMessage({ userId: req.user.id, role: "assistant", content: assistantReply });

  res.json({
    reply: assistantReply,
    links,
    messages: await getMessagesByUserId(req.user.id),
  });
});

const history = asyncHandler(async (req, res) => {
  res.json({ messages: await getMessagesByUserId(req.user.id) });
});

module.exports = { chat, history };
