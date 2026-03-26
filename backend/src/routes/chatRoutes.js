const express = require("express");
const { chat, history } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const { chatLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.get("/", protect, history);
router.post("/", protect, chatLimiter, chat);

module.exports = router;
