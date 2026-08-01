module.exports = {
  config: {
    name: "ping",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 3,
    role: 0,
    shortDescription: "Check bot response latency",
    longDescription: "Measures response time between server and messenger connection.",
    category: "System",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const startTime = Date.now();
    await message.reply("🏓 Pong! Measuring latency...");
    const latency = Date.now() - startTime;
    return message.reply(`⚡ Latency: ${latency}ms`);
  }
};
