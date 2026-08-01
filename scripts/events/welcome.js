module.exports = {
  config: {
    name: "welcome",
    version: "1.0.0",
    author: "GoatBot Team",
    category: "Events"
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
      const addedParticipants = event.logMessageData.addedParticipants || [];
      const botID = api.getCurrentUserID();

      for (const user of addedParticipants) {
        if (user.userFbId === botID) {
          api.sendMessage("👋 Thanks for adding GoatBot v2! Type !help to see available commands.", event.threadID);
        } else {
          api.sendMessage(`🎉 Welcome ${user.fullName} to the group!`, event.threadID);
        }
      }
    }
  }
};
