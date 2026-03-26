const sanitizeString = (value = "") =>
  String(value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeProfilePayload = (payload = {}) => ({
  name: sanitizeString(payload.name),
  email: sanitizeString(payload.email).toLowerCase(),
  dob: payload.dob || "",
  gender: sanitizeString(payload.gender),
  phone: sanitizeString(payload.phone),
  address: {
    state: sanitizeString(payload.address?.state),
    district: sanitizeString(payload.address?.district),
  },
  financialStatus: sanitizeString(payload.financialStatus).toLowerCase(),
  education: sanitizeString(payload.education).toLowerCase(),
  occupation: sanitizeString(payload.occupation),
  documentsOwned: Array.isArray(payload.documentsOwned)
    ? payload.documentsOwned.map((documentName) => sanitizeString(documentName)).filter(Boolean)
    : [],
  preferredLanguage: sanitizeString(payload.preferredLanguage).toLowerCase(),
});

module.exports = {
  sanitizeString,
  sanitizeProfilePayload,
};
