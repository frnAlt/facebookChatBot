const db = require("../../system/database");

module.exports = {
  config: {
    name: "daily",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 5,
    role: 0,
    shortDescription: "Claim daily economy reward coins",
    longDescription: "Receive 500 daily coins into your virtual economy wallet.",
    category: "Economy",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const user = db.getUser(event.senderID);
    const reward = 500;
    user.money = (user.money || 0) + reward;
    db.saveUsers();

    return message.reply(`💰 Daily Reward Claimed!\n+${reward} coins added to your wallet.\nTotal Balance: ${user.money} coins.`);
  }
};
