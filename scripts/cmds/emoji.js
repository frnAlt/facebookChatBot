module.exports = {
  config: {
    name: "emoji",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 1, // Group Admin
    shortDescription: "Change group thread default emoji",
    longDescription: "Updates the default chat reaction emoji for the current group thread.",
    category: "FCA Utility",
    guide: "{pn} <new emoji>"
  },

  onStart: async function ({ api, event, args, message }) {
    const emoji = args[0];
    if (!emoji) return message.reply("⚠️ Please provide an emoji to set. Example: !emoji 🔥");

    try {
      if (api && typeof api.changeGroupEmoji === "function") {
        await new Promise((res, rej) => {
          api.changeGroupEmoji(emoji, event.threadID, (err) => {
            if (err) rej(err);
            else res(true);
          });
        });
      }
      return message.reply(`✅ Group emoji updated to: ${emoji}`);
    } catch (e) {
      return message.reply(`❌ Failed to update group emoji: ${e.message}`);
    }
  }
};
