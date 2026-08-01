const memory = require("../../system/memory");

module.exports = {
  config: {
    name: "check",
    version: "1.0.0",
    author: "Gtajisan",
    countDown: 3,
    role: 0,
    shortDescription: "Check member activity and chat statistics",
    longDescription: "Displays message counts recorded in SQLite memory for thread participants.",
    category: "Utility",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const history = memory.getRecentChatHistory(event.threadID, 100);
    const userCounts = {};

    history.forEach((msg) => {
      const sender = msg.senderName || msg.senderID;
      userCounts[sender] = (userCounts[sender] || 0) + 1;
    });

    let resultMsg = "📊 GROUP MEMBER CHAT ACTIVITY STATS\n──────────────────────────────\n";
    const sorted = Object.entries(userCounts).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      return message.reply("📊 No chat activity stats recorded yet in memory database.");
    }

    sorted.forEach(([name, count], idx) => {
      resultMsg += `${idx + 1}. ${name}: ${count} msgs\n`;
    });

    return message.reply(resultMsg);
  }
};
