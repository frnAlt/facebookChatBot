const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs-extra");

const dbDir = path.join(__dirname, "db");
fs.ensureDirSync(dbDir);

const dbPath = path.join(dbDir, "memory.db");
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS user_memory (
    userID TEXT PRIMARY KEY,
    userName TEXT,
    notes TEXT,
    lastSeen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    threadID TEXT,
    senderID TEXT,
    senderName TEXT,
    messageText TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS threads_info (
    threadID TEXT PRIMARY KEY,
    threadName TEXT,
    prefix TEXT,
    lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

class MemoryManager {
  // Save incoming chat message
  saveChatMessage(threadID, senderID, messageText, senderName = "User") {
    try {
      const stmt = db.prepare(
        `INSERT INTO chat_history (threadID, senderID, senderName, messageText) VALUES (?, ?, ?, ?)`
      );
      stmt.run(threadID, senderID, senderName, messageText);
    } catch (e) {
      console.error("Memory error saveChatMessage:", e.message);
    }
  }

  // Retrieve context history for AI model
  getRecentChatHistory(threadID, limit = 10) {
    try {
      const stmt = db.prepare(
        `SELECT senderID, senderName, messageText, timestamp FROM chat_history WHERE threadID = ? ORDER BY id DESC LIMIT ?`
      );
      return stmt.all(threadID, limit).reverse();
    } catch (e) {
      return [];
    }
  }

  // Update user profile memory notes
  updateUserNote(userID, userName, newNote) {
    try {
      const stmt = db.prepare(`
        INSERT INTO user_memory (userID, userName, notes) VALUES (?, ?, ?)
        ON CONFLICT(userID) DO UPDATE SET notes = notes || ' ' || excluded.notes, userName = excluded.userName, lastSeen = CURRENT_TIMESTAMP
      `);
      stmt.run(userID, userName, newNote);
    } catch (e) {
      console.error("Memory error updateUserNote:", e.message);
    }
  }

  // Get user profile memory
  getUserMemory(userID) {
    try {
      const stmt = db.prepare(`SELECT * FROM user_memory WHERE userID = ?`);
      return stmt.get(userID) || { userID, userName: "Unknown", notes: "" };
    } catch (e) {
      return { userID, userName: "Unknown", notes: "" };
    }
  }

  // Get active threads list for web dashboard
  getActiveThreads(limit = 20) {
    try {
      const stmt = db.prepare(
        `SELECT threadID, COUNT(*) as totalMessages, MAX(timestamp) as lastActive FROM chat_history GROUP BY threadID ORDER BY lastActive DESC LIMIT ?`
      );
      return stmt.all(limit);
    } catch (e) {
      return [];
    }
  }

  // Get total chat message count
  getTotalMessagesCount() {
    try {
      const stmt = db.prepare(`SELECT COUNT(*) as count FROM chat_history`);
      const row = stmt.get();
      return row ? row.count : 0;
    } catch (e) {
      return 0;
    }
  }
}

module.exports = new MemoryManager();
