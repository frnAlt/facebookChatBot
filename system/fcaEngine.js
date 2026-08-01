const fs = require("fs");
const path = require("path");
const logger = require("./logger");

class FCAEngine {
  constructor(appStatePath = "appState.json") {
    this.appStatePath = path.resolve(appStatePath);
    this.api = null;
    this.messageQueue = [];
    this.isProcessingQueue = false;
    this.minDelayMs = 1200; // Humanized typing/sending delay
    this.maxDelayMs = 3000; // Anti-ban jitter buffer
    this.fcaModule = null;
  }

  // Load available FCA module or fall back smoothly
  resolveFCALibrary() {
    const fcaCandidates = [
      "@anbuinfosec/fca-unofficial",
      "@dongdev/fca-unofficial",
      "fca-project-orca",
      "fca-horizon-remake",
      "fca-unofficial",
      "@b374/fca-unofficial",
      "facebook-chat-api"
    ];

    for (const libName of fcaCandidates) {
      try {
        const lib = require(libName);
        logger.info(`FCA Engine resolved provider: ${libName}`);
        this.fcaModule = lib;
        return lib;
      } catch (e) {
        // Search next candidate
      }
    }

    logger.warn("No external FCA module detected in node_modules.");
    return null;
  }

  // Random delay helper to simulate natural human activity
  getRandomDelay() {
    return Math.floor(Math.random() * (this.maxDelayMs - this.minDelayMs + 1)) + this.minDelayMs;
  }

  // Load session cookies safely
  loadAppState() {
    if (!fs.existsSync(this.appStatePath)) {
      throw new Error(`appState.json not found at ${this.appStatePath}`);
    }
    const raw = fs.readFileSync(this.appStatePath, "utf8");
    return JSON.parse(raw);
  }

  // Initialize Connection & Authentication
  async init() {
    const login = this.resolveFCALibrary();
    const appState = this.loadAppState();

    // Check placeholder state
    if (appState[0]?.value?.includes("EXAMPLE") || appState[0]?.value === "100000000000000") {
      logger.warn("Placeholder cookies detected in appState.json. Engine standing by.");
      return null;
    }

    if (!login) {
      logger.warn("Engine running in Web Dashboard mode (Install FCA provider to connect to Messenger).");
      return null;
    }

    return new Promise((resolve, reject) => {
      login({ appState }, (err, api) => {
        if (err) {
          logger.error(`FCA Engine Login Failed: ${err.error || JSON.stringify(err)}`);
          return reject(err);
        }

        this.api = api;
        this.api.setOptions({
          listenEvents: true,
          selfListen: false,
          autoMarkDelivery: true,
          autoMarkRead: true
        });

        // Save refreshed cookies automatically
        try {
          if (typeof api.getAppState === "function") {
            fs.writeFileSync(this.appStatePath, JSON.stringify(api.getAppState(), null, 2));
            logger.success("Updated appState session cookies saved successfully.");
          }
        } catch (saveErr) {
          logger.warn(`Cookie auto-save warning: ${saveErr.message}`);
        }

        logger.success("✅ Custom FCA Engine active with humanized activity queues.");
        resolve(this.api);
      });
    });
  }

  // --- Safe Message Queue with Humanized Delays & Typing Simulation ---

  async safeSendMessage(msg, threadID, replyToMessageID = null) {
    return new Promise((resolve, reject) => {
      this.messageQueue.push({ msg, threadID, replyToMessageID, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.messageQueue.length === 0 || !this.api) return;
    this.isProcessingQueue = true;

    const task = this.messageQueue.shift();

    try {
      // 1. Simulate typing indicator if supported
      if (typeof this.api.sendTypingIndicator === "function") {
        this.api.sendTypingIndicator(task.threadID, () => {});
      }

      // 2. Wait humanized delay jitter
      await new Promise((r) => setTimeout(r, this.getRandomDelay()));

      // 3. Dispatch message safely
      this.api.sendMessage(task.msg, task.threadID, (err, info) => {
        if (err) task.reject(err);
        else task.resolve(info);
      }, task.replyToMessageID);
    } catch (error) {
      task.reject(error);
    } finally {
      this.isProcessingQueue = false;
      this.processQueue();
    }
  }

  // --- Core Messenger API Functions ---

  async editMessage(newText, messageID) {
    return new Promise((resolve, reject) => {
      if (!this.api || typeof this.api.editMessage !== "function") return resolve(false);
      this.api.editMessage(newText, messageID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async unsendMessage(messageID) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve(false);
      this.api.unsendMessage(messageID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async getUserInfo(userID) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve({ name: "User " + userID });
      this.api.getUserInfo(userID, (err, data) => {
        if (err) reject(err);
        else resolve(data[userID] || {});
      });
    });
  }

  async getThreadInfo(threadID) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve({ threadName: "Thread " + threadID, participantIDs: [] });
      this.api.getThreadInfo(threadID, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
  }

  async kickMember(userID, threadID) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve(false);
      this.api.removeUserFromGroup(userID, threadID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async addMember(userID, threadID) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve(false);
      this.api.addUserToGroup(userID, threadID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async setGroupTitle(title, threadID) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve(false);
      this.api.setTitle(title, threadID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async setAdminStatus(userID, threadID, isAdmin = true) {
    return new Promise((resolve, reject) => {
      if (!this.api) return resolve(false);
      this.api.changeAdminStatus(threadID, userID, isAdmin, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async changeNickname(nickname, threadID, userID) {
    return new Promise((resolve, reject) => {
      if (!this.api || typeof this.api.changeNickname !== "function") return resolve(false);
      this.api.changeNickname(nickname, threadID, userID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async changeGroupEmoji(emoji, threadID) {
    return new Promise((resolve, reject) => {
      if (!this.api || typeof this.api.changeGroupEmoji !== "function") return resolve(false);
      this.api.changeGroupEmoji(emoji, threadID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async changeThreadColor(color, threadID) {
    return new Promise((resolve, reject) => {
      if (!this.api || typeof this.api.changeThreadColor !== "function") return resolve(false);
      this.api.changeThreadColor(color, threadID, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

module.exports = FCAEngine;
