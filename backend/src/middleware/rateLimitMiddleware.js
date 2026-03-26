const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many chat requests. Please wait a few minutes and try again.",
  },
});

module.exports = { chatLimiter };
