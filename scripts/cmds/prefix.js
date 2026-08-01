const db = require("../../system/database");

module.exports = {
  config: {
    name: "prefix",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 3,
    role: 0,
    shortDescription: "Check or change thread prefix",
    longDescription: "Displays the current bot prefix or updates the prefix for the current thread.",
    category: "System",
    guide: "{pn} [new prefix]"
  },

  onStart: async function ({ api, event, args, message }) {
    const globalPrefix = global.GoatBot.config.prefix;
    const currentThreadPrefix = db.getThreadPrefix(event.threadID, globalPrefix);

    if (args.length === 0) {
      return message.reply(`📌 System Global Prefix: [ ${globalPrefix} ]\n💬 Current Thread Prefix: [ ${currentThreadPrefix} ]\nTo set a new prefix for this group, use: ${currentThreadPrefix}prefix <newPrefix>`);
    }

    const newPrefix = args[0];
    db.setThreadPrefix(event.threadID, newPrefix);
    return message.reply(`✅ Thread prefix updated to: [ ${newPrefix} ]`);
  }
};
