module.exports = {
  config: {
    name: "nickname",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 1, // Group Admin
    shortDescription: "Change member nickname in group chat",
    longDescription: "Updates the nickname of a tagged member or yourself in the current thread.",
    category: "FCA Utility",
    guide: "{pn} @mention <new nickname>"
  },

  onStart: async function ({ api, event, args, message }) {
    let targetID = event.senderID;
    let newNickname = args.join(" ");

    if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      const mentionName = event.mentions[targetID];
      newNickname = args.join(" ").replace(mentionName, "").trim();
    }

    try {
      if (api && typeof api.changeNickname === "function") {
        await new Promise((res, rej) => {
          api.changeNickname(newNickname, event.threadID, targetID, (err) => {
            if (err) rej(err);
            else res(true);
          });
        });
      }
      return message.reply(`✅ Nickname updated to: "${newNickname || 'Default'}"`);
    } catch (e) {
      return message.reply(`❌ Failed to update nickname: ${e.message}`);
    }
  }
};
