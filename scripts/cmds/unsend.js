module.exports = {
  config: {
    name: "unsend",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 2,
    role: 0,
    shortDescription: "Unsend bot message",
    longDescription: "Reply to any bot message with !unsend to delete it.",
    category: "Utility",
    guide: "Reply to bot message with {pn}"
  },

  onStart: async function ({ api, event, message }) {
    if (event.type !== "message_reply") {
      return message.reply("⚠️ Please reply to the bot message you wish to unsend.");
    }

    if (event.messageReply.senderID !== api.getCurrentUserID()) {
      return message.reply("❌ You can only unsend messages sent by the bot!");
    }

    return api.unsendMessage(event.messageReply.messageID, (err) => {
      if (err) message.reply("❌ Failed to unsend message.");
    });
  }
};
