module.exports = {
  config: {
    name: "kick",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 1, // Group Admin
    shortDescription: "Kick a member from the group",
    longDescription: "Removes specified member from group chat.",
    category: "Admin",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event, message, fcaEngine }) {
    const mentionIDs = Object.keys(event.mentions || {});
    if (mentionIDs.length === 0) {
      return message.reply("❌ Please tag (@mention) the member you want to kick.");
    }

    for (const userID of mentionIDs) {
      if (fcaEngine) {
        await fcaEngine.kickMember(userID, event.threadID);
      } else if (api && typeof api.removeUserFromGroup === "function") {
        await api.removeUserFromGroup(userID, event.threadID);
      }
    }

    return message.reply("✅ Member(s) kicked successfully.");
  }
};
