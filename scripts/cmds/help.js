module.exports = {
  config: {
    name: "help",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 5,
    role: 0,
    shortDescription: "Display command list and details",
    longDescription: "View all commands registered in GoatBot v2 or get specific details for a command.",
    category: "System",
    guide: "{pn} [command name]"
  },

  onStart: async function ({ api, event, args, message }) {
    const { commands } = global.GoatBot;
    const prefix = global.GoatBot.config.prefix;

    if (args.length === 0) {
      let msg = "--- 🤖 GOATBOT V2 COMMAND LIST ---\n\n";
      const categories = {};

      commands.forEach((cmd) => {
        const cat = cmd.config.category || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(cmd.config.name);
      });

      for (const [cat, cmds] of Object.entries(categories)) {
        msg += `📌 [ ${cat.toUpperCase()} ]\n`;
        msg += `> ${cmds.join(", ")}\n\n`;
      }

      msg += `---
Total Commands: ${commands.size}
Type "${prefix}help <command>" for detailed usage guidelines.`;
      return message.reply(msg);
    }

    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName);

    if (!command) {
      return message.reply(`❌ Command "${commandName}" was not found!`);
    }

    const cfg = command.config;
    let detailMsg = `ℹ️ COMMAND DETAILS: ${cfg.name.toUpperCase()}\n`;
    detailMsg += `----------------------------\n`;
    detailMsg += `• Description: ${cfg.shortDescription || cfg.longDescription || "N/A"}\n`;
    detailMsg += `• Category: ${cfg.category || "General"}\n`;
    detailMsg += `• Author: ${cfg.author || "Unknown"}\n`;
    detailMsg += `• Usage: ${cfg.guide ? cfg.guide.replace(/{pn}/g, prefix + cfg.name) : prefix + cfg.name}\n`;
    detailMsg += `• Cooldown: ${cfg.countDown || 0}s\n`;

    return message.reply(detailMsg);
  }
};
