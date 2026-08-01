module.exports = {
  config: {
    name: "group",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 5,
    role: 1, // 1 = Group Admin / 2 = Bot Admin
    shortDescription: "Group management and moderation tools",
    longDescription: "Allows admins to moderate members, update group title, and view thread specs.",
    category: "Admin",
    guide: "{pn} [kick @mention / info / name <new_name>]"
  },

  onStart: async function ({ api, event, args, message, fcaEngine }) {
    const subCommand = args[0]?.toLowerCase();

    if (!subCommand) {
      return message.reply("⚠️ Group Moderation Options:\n• !group kick @member\n• !group info\n• !group name <new name>");
    }

    try {
      if (subCommand === "kick") {
        const mentionIDs = Object.keys(event.mentions || {});
        if (mentionIDs.length === 0) {
          return message.reply("❌ Please tag (@mention) the group member you wish to remove.");
        }
        for (const userID of mentionIDs) {
          if (fcaEngine) {
            await fcaEngine.kickMember(userID, event.threadID);
          } else if (api && typeof api.removeUserFromGroup === "function") {
            await api.removeUserFromGroup(userID, event.threadID);
          }
        }
        return message.reply("✅ Targeted member(s) removed successfully.");
      }

      if (subCommand === "info") {
        let threadInfo = {};
        if (fcaEngine) {
          threadInfo = await fcaEngine.getThreadInfo(event.threadID);
        } else if (api && typeof api.getThreadInfo === "function") {
          threadInfo = await api.getThreadInfo(event.threadID);
        }

        const infoMsg = 
          `📊 GROUP THREAD DETAILS\n` +
          `───────────────\n` +
          `• Name: ${threadInfo.threadName || "No Group Name"}\n` +
          `• Thread ID: ${event.threadID}\n` +
          `• Total Members: ${threadInfo.participantIDs ? threadInfo.participantIDs.length : "N/A"}\n` +
          `• Admin Count: ${threadInfo.adminIDs ? threadInfo.adminIDs.length : "N/A"}`;

        return message.reply(infoMsg);
      }

      if (subCommand === "name") {
        const newName = args.slice(1).join(" ");
        if (!newName) return message.reply("❌ Please specify the new title for this group.");
        
        if (fcaEngine) {
          await fcaEngine.setGroupTitle(newName, event.threadID);
        } else if (api && typeof api.setTitle === "function") {
          await api.setTitle(newName, event.threadID);
        }
        return message.reply(`✅ Group title updated to: "${newName}"`);
      }

      return message.reply("❌ Invalid sub-command. Options: `kick`, `info`, `name`.");
    } catch (error) {
      console.error("Group Command Error:", error);
      return message.reply(`❌ Action failed: ${error.message}`);
    }
  }
};
