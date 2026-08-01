const { exec } = require("child_process");

module.exports = {
  config: {
    name: "shell",
    version: "1.0.0",
    author: "GoatBot Team",
    countDown: 5,
    role: 2, // Admin only
    shortDescription: "Execute terminal shell command (Admin only)",
    longDescription: "Runs shell command on the host server.",
    category: "Admin",
    guide: "{pn} <command>"
  },

  onStart: async function ({ api, event, args, message }) {
    const adminUIDs = global.GoatBot.config.adminUIDs || [];
    if (!adminUIDs.includes(event.senderID)) {
      return message.reply("⛔ Permission Denied: Admin role required to execute shell commands.");
    }

    const command = args.join(" ");
    if (!command) return message.reply("⚠️ Please provide a shell command to execute.");

    message.reply(`⚙️ Executing: \`${command}\` ...`);

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        return message.reply(`❌ Execution Error:\n${error.message}`);
      }
      if (stderr) {
        return message.reply(`⚠️ Stderr:\n${stderr}`);
      }
      const output = stdout.length > 1900 ? stdout.slice(0, 1900) + "\n...[truncated]" : stdout;
      return message.reply(`✅ Result:\n\`\`\`\n${output || "Done with no output."}\n\`\`\``);
    });
  }
};
