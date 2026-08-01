module.exports = {
  config: {
    name: "uid",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 2,
    role: 0,
    shortDescription: "Get Facebook User ID",
    longDescription: "Displays your Facebook User ID or the ID of tagged members.",
    category: "Utility",
    guide: "{pn} or tag someone"
  },

  onStart: async function ({ api, event, message }) {
    if (Object.keys(event.mentions || {}).length > 0) {
      let replyMsg = "";
      for (const [id, name] of Object.entries(event.mentions)) {
        replyMsg += `👤 ${name.replace("@", "")}: ${id}\n`;
      }
      return message.reply(replyMsg.trim());
    }

    const targetID = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
    return message.reply(`🆔 Your Facebook UID: ${targetID}`);
  }
};
