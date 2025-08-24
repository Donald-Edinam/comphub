const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./components.db", (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log("Connected to SQLite database.");
});

// Users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Components table
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    image_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// Migration: Add refresh_token column if it doesn't exist
db.run(`
  ALTER TABLE users ADD COLUMN refresh_token TEXT
`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Migration error:', err.message);
  }
});

module.exports = db;
