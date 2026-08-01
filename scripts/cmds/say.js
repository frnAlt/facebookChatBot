const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Text-to-Speech audio voice generator",
    longDescription: "Converts specified text into audio speech audio attachment.",
    category: "Media",
    guide: "{pn} <text to speak>"
  },

  onStart: async function ({ api, event, args, message }) {
    const text = args.join(" ");
    if (!text) return message.reply("⚠️ Please enter text for the bot to speak.");

    const lang = "en";
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

    try {
      if (api && typeof api.sendMessage === "function") {
        return api.sendMessage({
          body: `🔊 Voice Note: "${text}"`,
          url: ttsUrl
        }, event.threadID, event.messageID);
      }
      return message.reply(`🔊 Voice Note generated for: "${text}"\nStream: ${ttsUrl}`);
    } catch (err) {
      return message.reply(`🔊 Voice Note: ${text}`);
    }
  }
};
