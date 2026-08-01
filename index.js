const fs = require("fs");
const path = require("path");
const logger = require("./system/logger");
const db = require("./system/database");
const memory = require("./system/memory");
const FCAEngine = require("./system/fcaEngine");
const startWebServer = require("./system/webServer");

// Load Configuration
let config = {
  botName: "GoatBot v2",
  prefix: "!",
  adminUIDs: ["100000000000000"],
  port: 3000,
  options: {
    listenEvents: true,
    selfListen: false
  }
};

const configPath = path.join(__dirname, "config.json");
if (fs.existsSync(configPath)) {
  try {
    config = { ...config, ...JSON.parse(fs.readFileSync(configPath, "utf8")) };
  } catch (e) {
    logger.warn("Failed to parse config.json, using defaults.");
  }
}

const language = require("./system/language");

// Global GoatBot Core Architecture Object
global.GoatBot = {
  commands: new Map(),
  events: new Map(),
  onReply: new Map(),
  config: config,
  language: language
};

// Dynamically Load Commands from /scripts/cmds
function loadCommands() {
  const cmdsPath = path.join(__dirname, "scripts", "cmds");
  if (!fs.existsSync(cmdsPath)) fs.mkdirSync(cmdsPath, { recursive: true });

  const files = fs.readdirSync(cmdsPath).filter((f) => f.endsWith(".js"));
  let loadedCount = 0;

  files.forEach((file) => {
    try {
      const fullPath = path.join(cmdsPath, file);
      delete require.cache[require.resolve(fullPath)];
      const cmd = require(fullPath);

      if (cmd.config && cmd.config.name) {
        global.GoatBot.commands.set(cmd.config.name.toLowerCase(), cmd);
        logger.success(`Loaded command: ${cmd.config.name}`);
        loadedCount++;
      }
    } catch (err) {
      logger.error(`Failed to load command ${file}: ${err.message}`);
    }
  });

  logger.info(`Total commands registered: ${loadedCount}`);
}

// Dynamically Load Events from /scripts/events
function loadEvents() {
  const eventsPath = path.join(__dirname, "scripts", "events");
  if (!fs.existsSync(eventsPath)) fs.mkdirSync(eventsPath, { recursive: true });

  const files = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));
  let loadedCount = 0;

  files.forEach((file) => {
    try {
      const fullPath = path.join(eventsPath, file);
      delete require.cache[require.resolve(fullPath)];
      const evt = require(fullPath);

      if (evt.config && evt.config.name) {
        global.GoatBot.events.set(evt.config.name.toLowerCase(), evt);
        logger.success(`Loaded event: ${evt.config.name}`);
        loadedCount++;
      }
    } catch (err) {
      logger.error(`Failed to load event ${file}: ${err.message}`);
    }
  });

  logger.info(`Total events registered: ${loadedCount}`);
}

// Main Messenger MQTT & Hook Event Dispatcher
function setupMQTTListener(fcaEngine, api) {
  if (!api || typeof api.listenMqtt !== "function") return;

  api.listenMqtt(async (err, event) => {
    if (err) {
      logger.error(`MQTT Listener Error: ${err.message || err}`);
      return;
    }

    if (!event) return;

    // Helper message object (routes via humanized safeSendMessage queue)
    const messageHelper = {
      reply: (text, callback) => fcaEngine.safeSendMessage(text, event.threadID, event.messageID),
      send: (text, callback) => fcaEngine.safeSendMessage(text, event.threadID),
      unsend: (messageID) => fcaEngine.unsendMessage(messageID)
    };

    // 1. Execute registered event modules (welcome, leave, antiout)
    for (const [eventName, evtModule] of global.GoatBot.events.entries()) {
      try {
        if (typeof evtModule.onEvent === "function") {
          await evtModule.onEvent({ api, event, message: messageHelper, db, memory, logger, fcaEngine });
        }
      } catch (evtErr) {
        logger.error(`Error in event [${eventName}]: ${evtErr.message}`);
      }
    }

    // 2. Handle onReply callbacks if user replied to a bot message
    if (event.type === "message_reply" && event.messageReply) {
      const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);
      if (replyData && replyData.commandName) {
        const command = global.GoatBot.commands.get(replyData.commandName);
        if (command && typeof command.onReply === "function") {
          try {
            await command.onReply({ api, event, message: messageHelper, replyData, db, memory, logger, fcaEngine });
          } catch (rErr) {
            logger.error(`Error in onReply [${replyData.commandName}]: ${rErr.message}`);
          }
        }
      }
    }

    // 3. Execute onChat hooks across all modules (for conversation memory & auto AI responses)
    for (const [cmdName, cmdModule] of global.GoatBot.commands.entries()) {
      if (typeof cmdModule.onChat === "function") {
        try {
          await cmdModule.onChat({ api, event, message: messageHelper, db, memory, logger, fcaEngine });
        } catch (chatErr) {
          logger.error(`Error in onChat [${cmdName}]: ${chatErr.message}`);
        }
      }
    }

    // 4. Process Prefixed Commands
    if ((event.type === "message" || event.type === "message_reply") && event.body) {
      try {
        const threadPrefix = db.getThreadPrefix(event.threadID, global.GoatBot.config.prefix);
        const bodyText = event.body.trim();

        if (!bodyText.startsWith(threadPrefix)) return;

        const args = bodyText.slice(threadPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = global.GoatBot.commands.get(commandName);
        if (!command) return;

        // Check Permissions (0: Everyone, 1: Group Admin, 2: Bot Admin)
        const isBotAdmin = global.GoatBot.config.adminUIDs.includes(event.senderID);
        const roleRequired = command.config.role || 0;

        if (roleRequired === 2 && !isBotAdmin) {
          return messageHelper.reply("⛔ Permission Denied: Only Bot Admins can use this command.");
        }

        logger.cmd(`[ Thread ${event.threadID} ][ User ${event.senderID} ] Executed: !${commandName}`);

        // Run command onStart hook
        if (typeof command.onStart === "function") {
          await command.onStart({
            api,
            event,
            args,
            message: messageHelper,
            db,
            memory,
            logger,
            fcaEngine,
            role: isBotAdmin ? 2 : 0
          });
        }
      } catch (execErr) {
        logger.error(`Command Execution Error: ${execErr.stack || execErr.message}`);
        messageHelper.reply(`❌ Execution Error: ${execErr.message}`);
      }
    }
  });
}

// Main Master Launcher
async function startBot() {
  logger.banner();

  // 1. Start Keep-Alive Web Server Dashboard
  startWebServer(config.port || 3000);

  // 2. Dynamically Load Modules
  loadCommands();
  loadEvents();

  // 3. Initialize Rebuilt FCA Engine with Anti-Ban Queue
  const fcaEngine = new FCAEngine("appState.json");

  try {
    const api = await fcaEngine.init();
    if (api) {
      logger.success("🚀 GoatBot v2 x Floppa-Chatbot Fusion Engine is online and listening!");
      setupMQTTListener(fcaEngine, api);
    }
  } catch (loginErr) {
    logger.error(`Initialization failed: ${loginErr.message}`);
  }
}

// Global Exception Shields
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
});

// Launch
startBot();
