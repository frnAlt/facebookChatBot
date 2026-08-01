const chalk = require("chalk");
const moment = require("moment-timezone");

function getTime() {
  return moment().tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss");
}

const logger = {
  info: (msg) => {
    console.log(chalk.cyan(`[ ${getTime()} ][ INFO ]`) + ` ${msg}`);
  },
  success: (msg) => {
    console.log(chalk.green(`[ ${getTime()} ][ SUCCESS ]`) + ` ${msg}`);
  },
  warn: (msg) => {
    console.log(chalk.yellow(`[ ${getTime()} ][ WARN ]`) + ` ${msg}`);
  },
  error: (msg) => {
    console.log(chalk.red(`[ ${getTime()} ][ ERROR ]`) + ` ${msg}`);
  },
  cmd: (msg) => {
    console.log(chalk.magenta(`[ ${getTime()} ][ COMMAND ]`) + ` ${msg}`);
  },
  event: (msg) => {
    console.log(chalk.blue(`[ ${getTime()} ][ EVENT ]`) + ` ${msg}`);
  },
  banner: () => {
    console.log(chalk.cyan(`
======================================================
  ____             _   ____        _     ____   ___  
 / ___| ___   __ _| |_| __ )  ___ | |_  |_  /  / _ \\ 
| |  _ / _ \\ / _\` | __|  _ \\ / _ \\| __|  / /  | | | |
| |_| | (_) | (_| | |_| |_) | (_) | |_  /___|_| |_| |
 \\____|\\___/ \\__,_|\\__|____/ \\___/ \\__||____(_)\\___/ 
======================================================
  🚀 GoatBot v2 Architecture | High-Performance Engine
======================================================
`));
  }
};

module.exports = logger;
