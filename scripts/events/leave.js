module.exports = {
  config: {
    name: "leave",
    version: "1.0.0",
    author: "GoatBot Team",
    category: "Events"
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType === "log:unsubscribe") {
      const leftUID = event.logMessageData.leftParticipantFbId;
      const botID = api.getCurrentUserID();

      if (leftUID !== botID) {
        api.sendMessage(`👋 A member has left or been removed from the group. (UID: ${leftUID})`, event.threadID);
      }
    }
  }
};
