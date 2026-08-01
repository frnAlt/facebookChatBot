const db = require("../../system/database");

module.exports = {
  config: {
    name: "antiout",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 1, // Group Admin
    shortDescription: "Toggle anti-out protection for group",
    longDescription: "Automatically re-adds members if they attempt to leave the group chat.",
    category: "Admin",
    guide: "{pn} [on / off]"
  },

  onStart: async function ({ api, event, args, message }) {
    const statusStr = args[0]?.toLowerCase();
    const threadData = db.getThread(event.threadID);

    if (statusStr === "on" || statusStr === "enable") {
      db.setThreadAntiout(event.threadID, true);
      return message.reply("🛡️ Anti-Out protection is now **ENABLED** for this group.");
    }

    if (statusStr === "off" || statusStr === "disable") {
      db.setThreadAntiout(event.threadID, false);
      return message.reply("🛡️ Anti-Out protection is now **DISABLED** for this group.");
    }

    const currentStatus = threadData.antiout ? "ENABLED" : "DISABLED";
    return message.reply(`🛡️ Anti-Out Current Status: **${currentStatus}**\nUse: !antiout on or !antiout off`);
  }
};
