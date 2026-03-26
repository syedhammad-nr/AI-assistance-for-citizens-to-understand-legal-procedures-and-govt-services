const asyncHandler = require("../utils/asyncHandler");
const { toSafeUser, updateUserById } = require("../models/User");
const { sanitizeProfilePayload } = require("../utils/sanitize");
const { validateProfile } = require("../utils/validators");

const getProfile = asyncHandler(async (req, res) => {
  res.json({ profile: toSafeUser(req.user) });
});

const upsertProfile = asyncHandler(async (req, res) => {
  const sanitizedProfile = sanitizeProfilePayload({
    ...req.body,
    email: req.user.email,
  });

  validateProfile(sanitizedProfile);

  const updatedUser = await updateUserById(req.user.id, sanitizedProfile);

  res.json({
    message: "Profile updated successfully.",
    profile: toSafeUser(updatedUser),
  });
});

module.exports = { getProfile, upsertProfile };
