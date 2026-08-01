const fs = require("fs-extra");
const path = require("path");

const dbDir = path.join(__dirname, "db");
const threadsPath = path.join(dbDir, "threads.json");
const usersPath = path.join(dbDir, "users.json");

fs.ensureDirSync(dbDir);
if (!fs.existsSync(threadsPath)) fs.writeJsonSync(threadsPath, {});
if (!fs.existsSync(usersPath)) fs.writeJsonSync(usersPath, {});

class Database {
  constructor() {
    this.threads = fs.readJsonSync(threadsPath);
    this.users = fs.readJsonSync(usersPath);
  }

  saveThreads() {
    fs.writeJsonSync(threadsPath, this.threads, { spaces: 2 });
  }

  saveUsers() {
    fs.writeJsonSync(usersPath, this.users, { spaces: 2 });
  }

  // Thread Data Operations
  getThread(threadID) {
    if (!this.threads[threadID]) {
      this.threads[threadID] = {
        threadID,
        prefix: null,
        antiout: false,
        settings: {}
      };
      this.saveThreads();
    }
    return this.threads[threadID];
  }

  setThreadPrefix(threadID, prefix) {
    const thread = this.getThread(threadID);
    thread.prefix = prefix;
    this.saveThreads();
    return prefix;
  }

  getThreadPrefix(threadID, defaultPrefix) {
    const thread = this.getThread(threadID);
    return thread.prefix || defaultPrefix;
  }

  setThreadAntiout(threadID, status) {
    const thread = this.getThread(threadID);
    thread.antiout = Boolean(status);
    this.saveThreads();
    return thread.antiout;
  }

  // User Data Operations
  getUser(userID) {
    if (!this.users[userID]) {
      this.users[userID] = {
        userID,
        exp: 0,
        money: 100,
        banned: false
      };
      this.saveUsers();
    }
    return this.users[userID];
  }
}

module.exports = new Database();
