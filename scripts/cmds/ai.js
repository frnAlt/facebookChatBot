const axios = require("axios");
const memory = require("../../system/memory");

module.exports = {
  config: {
    name: "ai",
    version: "2.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 0,
    shortDescription: "Human-like conversational AI with memory context",
    longDescription: "Engages in natural human-like chat, remembers recent thread conversation history, and handles user queries.",
    category: "AI",
    guide: "{pn} <question or prompt>"
  },

  // Command invocation: !ai Hello
  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("🤖 Hey! What's on your mind? Ask me anything.");
    }

    return this.generateHumanReply({ api, event, prompt, message });
  },

  // Passive message handler: triggers when bot is tagged or replied to in chat
  onChat: async function ({ api, event, message }) {
    if (!event.body) return;

    // Record incoming message in SQLite memory database
    memory.saveChatMessage(event.threadID, event.senderID, event.body);

    const botID = api?.getCurrentUserID ? api.getCurrentUserID() : null;
    const isTagged = event.mentions && botID && Object.keys(event.mentions).includes(botID);
    const isReplyToBot = event.messageReply && botID && event.messageReply.senderID === botID;

    if (isTagged || isReplyToBot) {
      const cleanPrompt = event.body.replace(/@\w+/g, "").trim();
      if (!cleanPrompt) return;

      await this.generateHumanReply({ api, event, prompt: cleanPrompt, message });
    }
  },

  generateHumanReply: async function ({ api, event, prompt, message }) {
    try {
      // Retrieve recent conversation context from memory
      const history = memory.getRecentChatHistory(event.threadID, 6);
      const historyFormatted = history
        .map((h) => `${h.senderName || "User " + h.senderID}: ${h.messageText}`)
        .join("\n");

      // Construct rich persona prompt
      const systemContext = 
        `You are a witty, friendly, and helpful group member in a Messenger chat. ` +
        `Respond naturally like a human chatting with friends. ` +
        `Use light humor, concise sentences, and match the language of the prompt (Bangla, English, etc.).\n\n` +
        `Recent Thread Context:\n${historyFormatted}\n\nUser Question: ${prompt}`;

      const response = await axios.get(
        `https://api.pollinations.ai/p/${encodeURIComponent(systemContext)}`
      );

      if (response.data) {
        return message.reply(response.data.toString());
      } else {
        return message.reply("🤖 I received your query. How can I help you today?");
      }
    } catch (err) {
      console.error("AI Generation Error:", err.message);
      return message.reply(`🤖 I heard you! Context: "${prompt}" (AI processing fallback active)`);
    }
  }
};
