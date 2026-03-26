const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { findUserById } = require("../models/User");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is missing.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User session is invalid.");
  }

  req.user = user;
  next();
});

module.exports = { protect };
