module.exports = {
  config: {
    name: "avatar",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Get Facebook profile avatar picture",
    longDescription: "Fetches HD profile photo URL for mentioned user or yourself.",
    category: "Utility",
    guide: "{pn} or tag someone"
  },

  onStart: async function ({ api, event, message }) {
    let targetID = event.senderID;
    if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } else if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    }

    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    return message.reply(`🖼️ Profile Avatar for UID ${targetID}:\n${avatarUrl}`);
  }
};
