const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const {
  comparePassword,
  createUser,
  findUserByEmail,
  toSafeUser,
} = require("../models/User");
const { signToken } = require("../utils/jwt");
const { sanitizeProfilePayload, sanitizeString } = require("../utils/sanitize");
const { validateRegistration, validateLogin } = require("../utils/validators");

const register = asyncHandler(async (req, res) => {
  const sanitized = sanitizeProfilePayload(req.body);
  const password = sanitizeString(req.body.password);

  validateRegistration({
    name: sanitized.name,
    email: sanitized.email,
    password,
  });

  const existingUser = await findUserByEmail(sanitized.email);
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await createUser({
    ...sanitized,
    password,
  });

  res.status(201).json({
    token: signToken(user.id),
    user: toSafeUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const email = sanitizeString(req.body.email).toLowerCase();
  const password = sanitizeString(req.body.password);

  validateLogin({ email, password });

  const user = await findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  res.json({
    token: signToken(user.id),
    user: toSafeUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: toSafeUser(req.user) });
});

module.exports = { register, login, me };
