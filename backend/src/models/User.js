const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

const mapUserRow = (row) => {
  if (!row) {
    return null;
  }

  let documentsOwned = [];

  try {
    if (row.documents_owned) {
      documentsOwned = Array.isArray(row.documents_owned)
        ? row.documents_owned
        : JSON.parse(row.documents_owned);
    }
  } catch (_error) {
    documentsOwned = [];
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    dob: row.dob ? String(row.dob).split("T")[0] : "",
    gender: row.gender || "",
    phone: row.phone || "",
    address: {
      state: row.state || "",
      district: row.district || "",
    },
    financialStatus: row.financial_status || "",
    education: row.education || "",
    occupation: row.occupation || "",
    documentsOwned,
    preferredLanguage: row.preferred_language || "en",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toSafeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
};

const findUserByEmail = async (email) => {
  const rows = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return mapUserRow(rows[0]);
};

const findUserById = async (id) => {
  const rows = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return mapUserRow(rows[0]);
};

const createUser = async (userInput) => {
  const hashedPassword = await bcrypt.hash(userInput.password, 12);

  const result = await query(
    `
      INSERT INTO users (
        name, email, password, dob, gender, phone, state, district,
        financial_status, education, occupation, documents_owned, preferred_language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userInput.name,
      userInput.email,
      hashedPassword,
      userInput.dob || null,
      userInput.gender || "",
      userInput.phone || "",
      userInput.address?.state || "",
      userInput.address?.district || "",
      userInput.financialStatus || "",
      userInput.education || "",
      userInput.occupation || "",
      JSON.stringify(userInput.documentsOwned || []),
      userInput.preferredLanguage || "en",
    ],
  );

  return findUserById(result.insertId);
};

const updateUserById = async (id, userInput) => {
  await query(
    `
      UPDATE users
      SET
        name = ?,
        dob = ?,
        gender = ?,
        phone = ?,
        state = ?,
        district = ?,
        financial_status = ?,
        education = ?,
        occupation = ?,
        documents_owned = ?,
        preferred_language = ?
      WHERE id = ?
    `,
    [
      userInput.name,
      userInput.dob || null,
      userInput.gender || "",
      userInput.phone || "",
      userInput.address?.state || "",
      userInput.address?.district || "",
      userInput.financialStatus || "",
      userInput.education || "",
      userInput.occupation || "",
      JSON.stringify(userInput.documentsOwned || []),
      userInput.preferredLanguage || "en",
      id,
    ],
  );

  return findUserById(id);
};

const comparePassword = async (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);

const listUsers = async () => {
  const rows = await query("SELECT * FROM users ORDER BY created_at DESC");
  return rows.map(mapUserRow);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  comparePassword,
  listUsers,
  mapUserRow,
  toSafeUser,
};
