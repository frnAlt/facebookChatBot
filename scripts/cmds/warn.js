const db = require("../../system/database");

module.exports = {
  config: {
    name: "warn",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 1, // Group Admin
    shortDescription: "Group warning system for members",
    longDescription: "Issues warnings to members; kicks user automatically upon reaching 3 warnings.",
    category: "Admin",
    guide: "{pn} [@mention <reason> / list / reset @mention]"
  },

  onStart: async function ({ api, event, args, message, fcaEngine }) {
    const sub = args[0]?.toLowerCase();

    if (sub === "reset") {
      const mentionIDs = Object.keys(event.mentions || {});
      if (mentionIDs.length === 0) return message.reply("⚠️ Please tag (@mention) the user to reset warnings.");
      
      for (const uid of mentionIDs) {
        const user = db.getUser(uid);
        user.warns = 0;
      }
      db.saveUsers();
      return message.reply("✅ Member warnings reset to 0.");
    }

    const mentionIDs = Object.keys(event.mentions || {});
    if (mentionIDs.length === 0) {
      return message.reply("⚠️ Please tag (@mention) a group member to warn.");
    }

    const targetID = mentionIDs[0];
    const user = db.getUser(targetID);
    const reason = args.join(" ").replace(event.mentions[targetID], "").trim() || "No reason specified";

    user.warns = (user.warns || 0) + 1;
    db.saveUsers();

    if (user.warns >= 3) {
      user.warns = 0;
      db.saveUsers();
      message.reply(`⚠️ UID ${targetID} reached 3 warnings! Auto-kicking member...`);
      
      if (fcaEngine) {
        await fcaEngine.kickMember(targetID, event.threadID);
      } else if (api && typeof api.removeUserFromGroup === "function") {
        await api.removeUserFromGroup(targetID, event.threadID);
      }
      return;
    }

    return message.reply(`⚠️ Warning issued to UID ${targetID}\n• Reason: ${reason}\n• Current Warnings: ${user.warns}/3`);
  }
};
