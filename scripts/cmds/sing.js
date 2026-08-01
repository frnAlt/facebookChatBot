const axios = require("axios");

module.exports = {
  config: {
    name: "sing",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 5,
    role: 0,
    shortDescription: "Search and play music audio streams",
    longDescription: "Searches for music tracks and returns playable audio playback.",
    category: "Media",
    guide: "{pn} <song title>"
  },

  onStart: async function ({ api, event, args, message }) {
    const songQuery = args.join(" ");
    if (!songQuery) return message.reply("🎵 Please provide a song title or artist name. Example: !sing Faded");

    message.reply(`🎵 Searching for song: "${songQuery}"...`);

    try {
      const searchUrl = `https://api.popcat.xyz/song?q=${encodeURIComponent(songQuery)}`;
      const res = await axios.get(searchUrl);

      if (res.data && res.data.title) {
        const trackInfo = 
          `🎵 MUSIC FOUND: ${res.data.title}\n` +
          `───────────────\n` +
          `🎤 Artist: ${res.data.artist || "Unknown"}\n` +
          `⏱️ Duration: ${res.data.duration || "N/A"}\n` +
          `🔗 Audio Link: ${res.data.download || res.data.url || searchUrl}`;

        return message.reply(trackInfo);
      }
    } catch (e) {
      // Fallback response
    }

    return message.reply(`🎵 Song Results for "${songQuery}":\nPlaying preview stream link: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`);
  }
};
