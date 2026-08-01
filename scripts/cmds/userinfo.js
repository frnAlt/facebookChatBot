module.exports = {
  config: {
    name: "userinfo",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Fetch detailed Facebook User Profile information",
    longDescription: "Displays Facebook profile details, gender, account type, and profile link.",
    category: "FCA Utility",
    guide: "{pn} or tag someone"
  },

  onStart: async function ({ api, event, message, fcaEngine }) {
    let targetID = event.senderID;
    if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } else if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    }

    try {
      let info = {};
      if (fcaEngine) {
        info = await fcaEngine.getUserInfo(targetID);
      } else if (api && typeof api.getUserInfo === "function") {
        const res = await new Promise((r) => api.getUserInfo(targetID, (err, d) => r(d || {})));
        info = res[targetID] || {};
      }

      const infoMsg = 
        `👤 FACEBOOK USER INFORMATION\n` +
        `───────────────\n` +
        `• Name: ${info.name || "Unknown"}\n` +
        `• User ID: ${targetID}\n` +
        `• Profile URL: https://facebook.com/${info.vanity || targetID}\n` +
        `• Gender: ${info.gender === 2 ? "Male" : (info.gender === 1 ? "Female" : "Unspecified")}\n` +
        `• Is Friend: ${info.isFriend ? "Yes" : "No"}`;

      return message.reply(infoMsg);
    } catch (e) {
      return message.reply(`👤 User ID: ${targetID}\nProfile URL: https://facebook.com/${targetID}`);
    }
  }
};
