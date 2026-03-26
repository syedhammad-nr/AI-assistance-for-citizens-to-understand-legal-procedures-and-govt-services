const path = require("path");

// ✅ Load env FIRST
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// ✅ Import app AFTER env
const app = require("./src/app");

// ✅ Import DB (this auto-connects MySQL)
require("./src/config/db");

// ✅ Debug (optional)
console.log("JWT SECRET IN INDEX:", process.env.JWT_SECRET);

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});