const axios = require("axios");

module.exports = {
  config: {
    name: "cat",
    version: "1.0.0",
    author: "Gtajisan",
    countDown: 3,
    role: 0,
    shortDescription: "Get a random cute cat photo",
    longDescription: "Fetches HD random cat images.",
    category: "Fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const res = await axios.get("https://api.thecatapi.com/v1/images/search");
      const imgUrl = res.data[0]?.url;
      return message.reply(`🐱 Random Cat Image:\n${imgUrl}`);
    } catch (e) {
      return message.reply("🐱 Meow! Random Cat: https://cataas.com/cat");
    }
  }
};
