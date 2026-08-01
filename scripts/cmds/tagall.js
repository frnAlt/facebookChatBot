module.exports = {
  config: {
    name: "tagall",
    version: "1.0.0",
    author: "Gtajisan",
    countDown: 10,
    role: 1, // Group Admin
    shortDescription: "Mention all members in the group thread",
    longDescription: "Tags every participant in the group with a custom announcement message.",
    category: "Utility",
    guide: "{pn} <announcement message>"
  },

  onStart: async function ({ api, event, args, message, fcaEngine }) {
    const textMsg = args.join(" ") || "Attention everyone!";
    let threadInfo = {};

    try {
      if (fcaEngine) {
        threadInfo = await fcaEngine.getThreadInfo(event.threadID);
      } else if (api && typeof api.getThreadInfo === "function") {
        threadInfo = await new Promise((r) => api.getThreadInfo(event.threadID, (err, d) => r(d || {})));
      }
    } catch (e) {
      // Fallback
    }

    const participantIDs = threadInfo.participantIDs || [];
    if (participantIDs.length === 0) {
      return message.reply(`📣 Announcement: ${textMsg}`);
    }

    let mentions = [];
    let mentionBody = `📢 ANNOUNCEMENT: ${textMsg}\n\n`;

    participantIDs.forEach((id, idx) => {
      const tagStr = `@Member${idx + 1}`;
      mentionBody += `${tagStr} `;
      mentions.push({ tag: tagStr, id: id });
    });

    if (api && typeof api.sendMessage === "function") {
      return api.sendMessage({ body: mentionBody, mentions: mentions }, event.threadID);
    }

    return message.reply(mentionBody);
  }
};
