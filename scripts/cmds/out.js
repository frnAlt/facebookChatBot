module.exports = {
  config: {
    name: "out",
    version: "1.0.0",
    author: "Gtajisan",
    countDown: 5,
    role: 2, // Bot Admin Only
    shortDescription: "Make the bot leave a group chat thread",
    longDescription: "Instructs the bot to leave the current thread or a specified target thread ID.",
    category: "Admin",
    guide: "{pn} [optional target Thread ID]"
  },

  onStart: async function ({ api, event, args, message }) {
    const targetThreadID = args[0] || event.threadID;
    await message.reply(`👋 GoatBot v2 is leaving thread ${targetThreadID}. Goodbye!`);

    const botID = api?.getCurrentUserID ? api.getCurrentUserID() : null;
    if (botID && typeof api.removeUserFromGroup === "function") {
      return api.removeUserFromGroup(botID, targetThreadID);
    }
  }
};
