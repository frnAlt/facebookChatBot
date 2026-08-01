const db = require("../../system/database");

module.exports = {
  config: {
    name: "rank",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Check your profile rank and economy balance",
    longDescription: "Displays user experience points, level rank, and wallet balance.",
    category: "Economy",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const user = db.getUser(event.senderID);
    const exp = user.exp || 10;
    const level = Math.floor(Math.sqrt(exp / 10));

    const rankCard = 
      `🏆 USER PROFILE RANK CARD\n` +
      `────────────────────────\n` +
      `👤 User ID: ${event.senderID}\n` +
      `⭐ Level: ${level}\n` +
      `✨ EXP: ${exp} XP\n` +
      `💰 Wallet Balance: ${user.money || 100} coins`;

    return message.reply(rankCard);
  }
};
