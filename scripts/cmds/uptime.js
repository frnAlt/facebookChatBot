const os = require("os");

module.exports = {
  config: {
    name: "uptime",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 5,
    role: 0,
    shortDescription: "Check system uptime and hardware stats",
    longDescription: "Displays server uptime, Node.js version, memory usage, and platform specs.",
    category: "System",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const uptimeSec = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;

    const memory = process.memoryUsage();
    const heapUsedMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotalMB = (memory.heapTotal / 1024 / 1024).toFixed(2);

    const stats = `📊 GOATBOT V2 SYSTEM STATUS
----------------------------
⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
🧠 Memory Heap: ${heapUsedMB} MB / ${heapTotalMB} MB
💻 Platform: ${os.platform()} (${os.arch()})
🟢 Node.js: ${process.version}
⚡ Commands Loaded: ${global.GoatBot.commands.size}
🔥 Events Loaded: ${global.GoatBot.events.size}`;

    return message.reply(stats);
  }
};
