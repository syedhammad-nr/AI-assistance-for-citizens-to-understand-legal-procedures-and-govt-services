const mysql = require("mysql2/promise");

let pool;

const getDbConfig = () => {
  const config = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
    user: process.env.DB_USER || process.env.MYSQL_USER || "root",
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "",
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE || "legal_gov_assistant",
  };

  console.log("DB_HOST:", config.host);
  console.log("DB_USER:", config.user);
  console.log("DB_PASSWORD:", config.password || "(undefined or empty)");

  return config;
};

const getPool = () => {
  if (!pool) {
    const dbConfig = getDbConfig();

    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
};

const query = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  return rows;
};

const columnExists = async (tableName, columnName) => {
  const rows = await query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [getDbConfig().database, tableName, columnName],
  );

  return rows.length > 0;
};

const ensureColumn = async (tableName, columnName, definition) => {
  if (!(await columnExists(tableName, columnName))) {
    await query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
  }
};

const ensureSchema = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      dob DATE NULL,
      gender VARCHAR(50) DEFAULT '',
      phone VARCHAR(20) DEFAULT '',
      state VARCHAR(120) DEFAULT '',
      district VARCHAR(120) DEFAULT '',
      financial_status VARCHAR(20) DEFAULT '',
      education VARCHAR(50) DEFAULT '',
      occupation VARCHAR(255) DEFAULT '',
      documents_owned JSON NULL,
      preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await ensureColumn("users", "email", "VARCHAR(255) NOT NULL");
  await ensureColumn("users", "password", "VARCHAR(255) NOT NULL");
  await ensureColumn("users", "dob", "DATE NULL");
  await ensureColumn("users", "preferred_language", "VARCHAR(10) NOT NULL DEFAULT 'en'");
  await ensureColumn("users", "gender", "VARCHAR(50) DEFAULT ''");
  await ensureColumn("users", "phone", "VARCHAR(20) DEFAULT ''");
  await ensureColumn("users", "state", "VARCHAR(120) DEFAULT ''");
  await ensureColumn("users", "district", "VARCHAR(120) DEFAULT ''");
  await ensureColumn("users", "financial_status", "VARCHAR(20) DEFAULT ''");
  await ensureColumn("users", "education", "VARCHAR(50) DEFAULT ''");
  await ensureColumn("users", "occupation", "VARCHAR(255) DEFAULT ''");
  await ensureColumn("users", "documents_owned", "JSON NULL");

  await query(`
    CREATE TABLE IF NOT EXISTS conversation_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_conversation_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);
};

const connectDatabase = async () => {
  const dbConfig = getDbConfig();

  if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
    throw new Error("Missing required database environment variables. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in backend/.env");
  }

  const bootstrapConnection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  });
  await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  await bootstrapConnection.end();

  const db = getPool();
  const connection = await db.getConnection();
  await connection.ping();
  connection.release();
  await ensureSchema();
  console.log("MySQL Connected");
};

module.exports = {
  connectDatabase,
  getPool,
  query,
};
