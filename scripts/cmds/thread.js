module.exports = {
  config: {
    name: "thread",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 5,
    role: 1, // Group Admin
    shortDescription: "Thread administrative management options",
    longDescription: "View thread details, leave thread, or update group settings.",
    category: "FCA Utility",
    guide: "{pn} [info / leave]"
  },

  onStart: async function ({ api, event, args, message }) {
    const sub = args[0]?.toLowerCase();

    if (sub === "leave") {
      await message.reply("👋 GoatBot v2 is leaving this group thread. Goodbye!");
      const botID = api?.getCurrentUserID ? api.getCurrentUserID() : null;
      if (botID && typeof api.removeUserFromGroup === "function") {
        return api.removeUserFromGroup(botID, event.threadID);
      }
      return;
    }

    if (sub === "info" || !sub) {
      try {
        const info = await new Promise((res) => api.getThreadInfo(event.threadID, (err, data) => res(data || {})));
        const threadMsg = 
          `💬 THREAD INFORMATION\n` +
          `───────────────\n` +
          `• Title: ${info.threadName || "No Group Name"}\n` +
          `• Thread ID: ${event.threadID}\n` +
          `• Total Members: ${info.participantIDs ? info.participantIDs.length : 0}\n` +
          `• Message Count: ${info.messageCount || "N/A"}\n` +
          `• Admins Count: ${info.adminIDs ? info.adminIDs.length : 0}`;

        return message.reply(threadMsg);
      } catch (e) {
        return message.reply(`💬 Thread ID: ${event.threadID}`);
      }
    }

    return message.reply("❌ Usage: !thread info or !thread leave");
  }
};
