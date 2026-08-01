const express = require("express");
const path = require("path");
const logger = require("./logger");
const memory = require("./memory");

// Buffer to store recent logs for live terminal on dashboard
const logsBuffer = [];
const MAX_LOGS = 100;

function pushLog(level, message) {
  const timestamp = new Date().toLocaleTimeString();
  logsBuffer.unshift({ timestamp, level, message });
  if (logsBuffer.length > MAX_LOGS) logsBuffer.pop();
}

// Override logger methods to mirror output to dashboard terminal
const originalInfo = logger.info;
const originalSuccess = logger.success;
const originalWarn = logger.warn;
const originalError = logger.error;
const originalCmd = logger.cmd;

logger.info = (msg) => { originalInfo(msg); pushLog("INFO", msg); };
logger.success = (msg) => { originalSuccess(msg); pushLog("SUCCESS", msg); };
logger.warn = (msg) => { originalWarn(msg); pushLog("WARN", msg); };
logger.error = (msg) => { originalError(msg); pushLog("ERROR", msg); };
logger.cmd = (msg) => { originalCmd(msg); pushLog("COMMAND", msg); };

function startWebServer(port = 3000) {
  const app = express();

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.json());

  // API Status & System Metrics
  app.get("/api/status", (req, res) => {
    const memoryUsage = process.memoryUsage();
    res.json({
      status: "online",
      botName: global.GoatBot?.config?.botName || "GoatBot v2",
      developer: "Farhan Muh Tasim (@Gtajisan)",
      prefix: global.GoatBot?.config?.prefix || "!",
      uptime: process.uptime(),
      commandsCount: global.GoatBot?.commands?.size || 0,
      eventsCount: global.GoatBot?.events?.size || 0,
      totalMessagesRecorded: memory.getTotalMessagesCount(),
      activeThreadsCount: memory.getActiveThreads().length,
      memoryUsage: {
        rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(1),
        heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(1),
        heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(1)
      }
    });
  });

  // API Live Logs Terminal
  app.get("/api/logs", (req, res) => {
    res.json(logsBuffer);
  });

  // API Threads & SQLite Memory
  app.get("/api/threads", (req, res) => {
    const activeThreads = memory.getActiveThreads(30);
    res.json(activeThreads);
  });

  // API Registered Commands Suite
  app.get("/api/commands", (req, res) => {
    const cmds = [];
    if (global.GoatBot?.commands) {
      for (const [name, module] of global.GoatBot.commands.entries()) {
        cmds.push({
          name: module.config.name,
          category: module.config.category || "General",
          shortDescription: module.config.shortDescription || module.config.description || "No description",
          role: module.config.role || 0,
          author: module.config.author || "Farhan Muh Tasim",
          countDown: module.config.countDown || 0
        });
      }
    }
    res.json(cmds);
  });

  // API Configuration Settings
  app.get("/api/config", (req, res) => {
    res.json({
      botName: global.GoatBot?.config?.botName || "GoatBot v2",
      prefix: global.GoatBot?.config?.prefix || "!",
      adminUIDs: global.GoatBot?.config?.adminUIDs || [],
      port: port
    });
  });

  app.listen(port, () => {
    logger.info(`Web Control Dashboard listening live on port ${port}`);
  }).on("error", (err) => {
    logger.warn(`Web Server port ${port} busy: ${err.message}`);
  });
}

module.exports = startWebServer;
