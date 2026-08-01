module.exports = {
  config: {
    name: "antiout",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    category: "Events"
  },

  onEvent: async function ({ api, event, db, logger, fcaEngine }) {
    if (event.logMessageType === "log:unsubscribe") {
      const leftUID = event.logMessageData.leftParticipantFbId;
      const botID = api?.getCurrentUserID ? api.getCurrentUserID() : null;

      // Ignore if the bot itself left or was removed
      if (leftUID === botID) return;

      // Check if antiout is enabled for this thread
      const threadData = db.getThread(event.threadID);
      if (threadData && threadData.antiout) {
        logger.event(`[ AntiOut ] Re-adding user ${leftUID} to thread ${event.threadID}...`);

        try {
          if (fcaEngine) {
            await fcaEngine.addMember(leftUID, event.threadID);
          } else if (api && typeof api.addUserToGroup === "function") {
            await api.addUserToGroup(leftUID, event.threadID);
          }
          api.sendMessage(`🛡️ [ Anti-Out Active ] Automatically re-added UID ${leftUID} back to the group!`, event.threadID);
        } catch (err) {
          logger.warn(`[ AntiOut Failed ] Could not re-add ${leftUID}: ${err.message}`);
        }
      }
    }
  }
};
