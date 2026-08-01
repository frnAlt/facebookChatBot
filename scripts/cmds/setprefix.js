const db = require("../../system/database");

module.exports = {
  config: {
    name: "setprefix",
    version: "1.0.0",
    author: "Gtajisan",
    countDown: 3,
    role: 1, // Group Admin
    shortDescription: "Change the bot command prefix for this thread",
    longDescription: "Updates the custom prefix required to trigger bot commands in this group.",
    category: "System",
    guide: "{pn} <newPrefix>"
  },

  onStart: async function ({ api, event, args, message }) {
    const newPrefix = args[0];
    if (!newPrefix) {
      const current = db.getThreadPrefix(event.threadID, global.GoatBot.config.prefix);
      return message.reply(`📌 Current thread prefix: [ ${current} ]\nUsage: !setprefix <newPrefix>`);
    }

    db.setThreadPrefix(event.threadID, newPrefix);
    return message.reply(`✅ Thread prefix updated to: [ ${newPrefix} ]`);
  }
};
