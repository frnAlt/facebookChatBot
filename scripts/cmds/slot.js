const db = require("../../system/database");

module.exports = {
  config: {
    name: "slot",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Casino slots machine economy minigame",
    longDescription: "Gamble coins on the slot machine to win or lose coins.",
    category: "Economy",
    guide: "{pn} <bet amount>"
  },

  onStart: async function ({ api, event, args, message }) {
    const user = db.getUser(event.senderID);
    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return message.reply("🎰 Please specify a valid positive bet amount. Example: !slot 50");
    }

    if ((user.money || 0) < bet) {
      return message.reply(`❌ Insufficient balance! Your wallet balance is: ${user.money || 0} coins.`);
    }

    const items = ["🍇", "🍉", "🍊", "🍋", "🍌", "🍓", "🍒"];
    const slot1 = items[Math.floor(Math.random() * items.length)];
    const slot2 = items[Math.floor(Math.random() * items.length)];
    const slot3 = items[Math.floor(Math.random() * items.length)];

    let win = false;
    let multiplier = 0;

    if (slot1 === slot2 && slot2 === slot3) {
      win = true;
      multiplier = 3;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      win = true;
      multiplier = 1.5;
    }

    if (win) {
      const winnings = Math.floor(bet * multiplier);
      user.money += winnings;
      db.saveUsers();
      return message.reply(`🎰 [ ${slot1} | ${slot2} | ${slot3} ]\n🎉 YOU WON ${winnings} coins! New balance: ${user.money} coins.`);
    } else {
      user.money -= bet;
      db.saveUsers();
      return message.reply(`🎰 [ ${slot1} | ${slot2} | ${slot3} ]\n💸 YOU LOST ${bet} coins. New balance: ${user.money} coins.`);
    }
  }
};
