const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dob = null,
      preferredLanguage = "en",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email, and password are required",
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    const existingUsers = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [email.toLowerCase()]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          dob,
          preferred_language
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [name.trim(), email.toLowerCase().trim(), hashedPassword, dob || null, preferredLanguage || "en"],
    );

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("createUser error:", error.message);
    return res.status(500).json({
      error: "Failed to create user",
    });
  }
};

exports.getUsers = async (_req, res) => {
  try {
    const users = await query(
      `
        SELECT
          id,
          name,
          email,
          dob,
          preferred_language AS preferredLanguage,
          created_at AS createdAt
        FROM users
        ORDER BY created_at DESC
      `,
    );

    return res.json({ users });
  } catch (error) {
    console.error("getUsers error:", error.message);
    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};
