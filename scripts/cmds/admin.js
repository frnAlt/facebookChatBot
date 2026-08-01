module.exports = {
  config: {
    name: "admin",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 3,
    role: 2, // Bot Admin Only
    shortDescription: "Manage Bot Admins",
    longDescription: "Allows primary admin to add, remove, or list Bot Admins.",
    category: "Admin",
    guide: "{pn} [add <UID> / remove <UID> / list]"
  },

  onStart: async function ({ api, event, args, message }) {
    const sub = args[0]?.toLowerCase();
    const adminList = global.GoatBot.config.adminUIDs || [];

    if (sub === "list" || !sub) {
      let msg = "👑 GOATBOT V2 ADMIN LIST\n--------------------\n";
      adminList.forEach((uid, idx) => {
        msg += `${idx + 1}. UID: ${uid}\n`;
      });
      return message.reply(msg);
    }

    const targetUID = args[1] || (Object.keys(event.mentions || {})[0]);

    if (sub === "add") {
      if (!targetUID) return message.reply("⚠️ Please provide a UID or tag a user to add as admin.");
      if (adminList.includes(targetUID)) return message.reply("⚠️ User is already a Bot Admin.");
      
      adminList.push(targetUID);
      global.GoatBot.config.adminUIDs = adminList;
      return message.reply(`✅ Added UID ${targetUID} to Bot Admins.`);
    }

    if (sub === "remove" || sub === "del") {
      if (!targetUID) return message.reply("⚠️ Please provide a UID to remove.");
      const index = adminList.indexOf(targetUID);
      if (index === -1) return message.reply("❌ Target UID is not in Bot Admin list.");

      adminList.splice(index, 1);
      global.GoatBot.config.adminUIDs = adminList;
      return message.reply(`✅ Removed UID ${targetUID} from Bot Admins.`);
    }

    return message.reply("❌ Invalid option. Use: !admin list, !admin add <UID>, or !admin remove <UID>");
  }
};
