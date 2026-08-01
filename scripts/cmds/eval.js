module.exports = {
  config: {
    name: "eval",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 2, // Bot Admin Only
    shortDescription: "Execute JavaScript code dynamically (Admin Only)",
    longDescription: "Evaluates JS code snippet on the bot process.",
    category: "Admin",
    guide: "{pn} <code>"
  },

  onStart: async function ({ api, event, args, message, db, memory, fcaEngine }) {
    const code = args.join(" ");
    if (!code) return message.reply("⚠️ Please enter JavaScript code to evaluate.");

    try {
      let output = await eval(`(async () => { ${code} })()`);
      if (typeof output !== "string") {
        output = require("util").inspect(output, { depth: 1 });
      }
      return message.reply(`✅ Eval Output:\n\`\`\`js\n${output.slice(0, 1800)}\n\`\`\``);
    } catch (err) {
      return message.reply(`❌ Eval Error:\n\`\`\`js\n${err.message}\n\`\`\``);
    }
  }
};
