const {
  SUPPORTED_LANGUAGES,
  FINANCIAL_STATUSES,
  EDUCATION_LEVELS,
  DOCUMENT_OPTIONS,
} = require("../constants/appConstants");
const ApiError = require("./apiError");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^[6-9]\d{9}$/.test(value);

const ensureRequired = (value, message) => {
  if (!value) {
    throw new ApiError(400, message);
  }
};

const validateRegistration = ({ name, email, password }) => {
  ensureRequired(name, "Full name is required.");
  ensureRequired(email, "Email is required.");
  ensureRequired(password, "Password is required.");

  if (!isEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }
};

const validateLogin = ({ email, password }) => {
  ensureRequired(email, "Email is required.");
  ensureRequired(password, "Password is required.");

  if (!isEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }
};

const validateProfile = (profile) => {
  ensureRequired(profile.name, "Full name is required.");

  if (profile.phone && !isPhone(profile.phone)) {
    throw new ApiError(400, "Phone number must be a valid 10-digit Indian mobile number.");
  }

  if (profile.financialStatus && !FINANCIAL_STATUSES.includes(profile.financialStatus)) {
    throw new ApiError(400, "Invalid financial condition selected.");
  }

  if (profile.education && !EDUCATION_LEVELS.includes(profile.education)) {
    throw new ApiError(400, "Invalid education level selected.");
  }

  if (profile.preferredLanguage && !SUPPORTED_LANGUAGES.includes(profile.preferredLanguage)) {
    throw new ApiError(400, "Unsupported preferred language.");
  }

  if (profile.documentsOwned.some((documentName) => !DOCUMENT_OPTIONS.includes(documentName))) {
    throw new ApiError(400, "One or more selected government documents are invalid.");
  }
};

const validateChatMessage = (message) => {
  ensureRequired(message, "Message is required.");

  if (message.length < 3) {
    throw new ApiError(400, "Please enter a more detailed question.");
  }

  if (message.length > 1200) {
    throw new ApiError(400, "Message is too long.");
  }
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfile,
  validateChatMessage,
};
