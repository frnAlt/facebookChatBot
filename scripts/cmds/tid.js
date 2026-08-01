module.exports = {
  config: {
    name: "tid",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 2,
    role: 0,
    shortDescription: "Get current Thread ID",
    longDescription: "Displays the unique Facebook Thread ID of the current group or direct message chat.",
    category: "Utility",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    return message.reply(`💬 Current Chat Thread ID: ${event.threadID}`);
  }
};
