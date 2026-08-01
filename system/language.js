const fs = require("fs-extra");
const path = require("path");

const langDir = path.join(__dirname, "languages");
fs.ensureDirSync(langDir);

const defaultEn = {
  "system.started": "GoatBot v2 is online and listening!",
  "system.loginFailed": "Login failed: %1",
  "command.notFound": "Command %1 was not found!",
  "command.noPermission": "You do not have permission to use this command.",
  "command.error": "An error occurred while executing command: %1"
};

const enPath = path.join(langDir, "en.json");
if (!fs.existsSync(enPath)) {
  fs.writeJsonSync(enPath, defaultEn, { spaces: 2 });
}

class LanguageManager {
  constructor(defaultLang = "en") {
    this.defaultLang = defaultLang;
    this.languages = {};
    this.loadLanguages();
  }

  loadLanguages() {
    const files = fs.readdirSync(langDir).filter((f) => f.endsWith(".json"));
    files.forEach((file) => {
      const langName = path.basename(file, ".json");
      try {
        this.languages[langName] = fs.readJsonSync(path.join(langDir, file));
      } catch (e) {
        console.error(`Failed to load language file ${file}:`, e.message);
      }
    });
  }

  getText(langKey, ...args) {
    const langObj = this.languages[this.defaultLang] || this.languages["en"] || {};
    let text = langObj[langKey] || langKey;

    args.forEach((arg, index) => {
      text = text.replace(new RegExp(`%${index + 1}`, "g"), arg);
    });

    return text;
  }
}

module.exports = new LanguageManager();
