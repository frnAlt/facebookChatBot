module.exports = {
  config: {
    name: "restart",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 10,
    role: 2, // Bot Admin
    shortDescription: "Restart the bot process",
    longDescription: "Reboots the chatbot process and reloads all modules.",
    category: "Admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    await message.reply("🔄 GoatBot v2 is restarting now...");
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};
