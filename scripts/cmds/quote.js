const axios = require("axios");

module.exports = {
  config: {
    name: "quote",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Get a random motivational quote",
    longDescription: "Fetches inspirational quotes and advice.",
    category: "Fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const res = await axios.get("https://api.quotable.io/random");
      return message.reply(`💬 "${res.data.content}"\n— ${res.data.author}`);
    } catch (err) {
      return message.reply(`💬 "Code should solve problems, not create them."\n— Farhan Muh Tasim`);
    }
  }
};
