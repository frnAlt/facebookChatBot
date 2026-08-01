const express = require("express");
const path = require("path");
const logger = require("./logger");
const memory = require("./memory");

function startWebServer(port = 3000) {
  const app = express();

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.json());

  // API Status & System Metrics
  app.get("/api/status", (req, res) => {
    res.json({
      status: "online",
      botName: global.GoatBot?.config?.botName || "GoatBot v2",
      developer: "Farhan Muh Tasim (@Gtajisan)",
      uptime: process.uptime(),
      commandsCount: global.GoatBot?.commands?.size || 0,
      eventsCount: global.GoatBot?.events?.size || 0,
      totalMessagesRecorded: memory.getTotalMessagesCount(),
      activeThreadsCount: memory.getActiveThreads().length,
      memoryUsage: process.memoryUsage()
    });
  });

  // API Threads & History endpoint
  app.get("/api/threads", (req, res) => {
    const activeThreads = memory.getActiveThreads(20);
    res.json(activeThreads);
  });

  // API Registered Commands List
  app.get("/api/commands", (req, res) => {
    const cmds = [];
    if (global.GoatBot?.commands) {
      for (const [name, module] of global.GoatBot.commands.entries()) {
        cmds.push({
          name: module.config.name,
          category: module.config.category || "General",
          shortDescription: module.config.shortDescription || "No description",
          role: module.config.role || 0,
          author: module.config.author || "Unknown"
        });
      }
    }
    res.json(cmds);
  });

  app.listen(port, () => {
    logger.info(`Web Dashboard listening at http://localhost:${port}`);
  }).on("error", (err) => {
    logger.warn(`Web Server port ${port} busy: ${err.message}`);
  });
}

module.exports = startWebServer;
