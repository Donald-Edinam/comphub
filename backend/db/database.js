const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./components.db", (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log("Connected to SQLite database.");
});

// Create components table
db.run(`
  CREATE TABLE IF NOT EXISTS components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    quantity INTEGER DEFAULT 0,
    supplier TEXT,
    price REAL,
    status TEXT,
    description TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
