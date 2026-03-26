const { query } = require("../config/db");

const getMessagesByUserId = async (userId, limit) => {
  const sql =
    typeof limit === "number"
      ? `
          SELECT role, content, created_at AS createdAt
          FROM conversation_messages
          WHERE user_id = ?
          ORDER BY id DESC
          LIMIT ?
        `
      : `
          SELECT role, content, created_at AS createdAt
          FROM conversation_messages
          WHERE user_id = ?
          ORDER BY id ASC
        `;

  const rows = typeof limit === "number" ? await query(sql, [userId, limit]) : await query(sql, [userId]);

  return typeof limit === "number" ? rows.reverse() : rows;
};

const addMessage = async ({ userId, role, content }) => {
  await query("INSERT INTO conversation_messages (user_id, role, content) VALUES (?, ?, ?)", [
    userId,
    role,
    content,
  ]);
};

module.exports = {
  getMessagesByUserId,
  addMessage,
};
