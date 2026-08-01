<div align="center">

# 🤖 facebookChatBot

### *Next-Gen Modular AI Messenger Chatbot & Safe FCA Architecture*

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![Express.js](https://img.shields.io/badge/Express.js-Dashboard-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-Long--Term_Memory-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  A high-performance, modular, and human-like Facebook Messenger Chatbot built on <strong>Node.js</strong> and <strong>GoatBot v2</strong> architecture. Powered by a custom anti-ban FCA engine, SQLite conversation memory, group moderation tools, and a real-time web control panel.
</p>

[Key Features](#-key-features) •
[Quick Start](#-quick-start) •
[Command Suite](#-command-suite) •
[Developer Guide](#-developer-module-creation-guide) •
[Web Dashboard](#-web-dashboard--247-hosting) •
[Developer Info](#-developer--author-info)

</div>

---

## 📌 Table of Contents

- [✨ Key Features](#-key-features)
- [👨‍💻 Developer & Author Info](#-developer--author-info)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🔐 Session Cookie Setup (`appState.json`)](#-session-cookie-setup-appstatejson)
- [🛠️ Developer Module Creation Guide](#-developer-module-creation-guide)
- [⚙️ Command Suite & Event Modules](#️-command-suite--event-modules)
- [🛡️ Anti-Ban & Security Safeguards](#️-anti-ban--security-safeguards)
- [🌐 Web Dashboard & 24/7 Hosting](#-web-dashboard--247-hosting)
- [🐙 GitHub Push Guide](#-github-push-guide)
- [📜 License & Support](#-license--support)

---

## ✨ Key Features

- 🛡️ **Rebuilt Safe FCA Engine (`fcaEngine.js`)**: Internal message queue with humanized 1.2s–3.0s jitter delays to bypass spam triggers.
- ⌨️ **Typing Emulation**: Simulates human typing indicators (`sendTypingIndicator`) before dispatching message responses.
- 🧠 **SQLite Conversation Memory (`memory.js`)**: Long-term message logging enabling natural AI conversations with thread context.
- 🤖 **Human-Like AI Chatbot (`!ai`)**: Answers command queries and passively responds when tagged or replied to in group chats.
- 👑 **Group Moderation Tools (`!group`, `!warn`, `!antiout`)**: Admin commands for member removal, member warning system with auto-kick, and antiout protection.
- 🌐 **Glassmorphic Web Dashboard**: Real-time Express UI displaying system metrics, live terminal logs, loaded commands, SQLite memory, and author info.
- ⚡ **Hot-Reloadable Command Framework**: Dynamic module loader supporting `onStart`, `onChat`, `onReply`, and `onEvent` execution hooks.
- 🔐 **Session Persistence**: Automatic cookie refresh and auto-saving back to `appState.json`.

---

## 👨‍💻 Developer & Author Info

```json
{
  "developer": "Gtajisan",
  "aliases": ["Gtajisan", "frnAlt"],
  "location": "Chattogram, Bangladesh",
  "role": "Backend Developer & Cybersecurity Enthusiast",
  "expertise": [
    "API Architecture & Microservices",
    "Server-Side Logic & Node.js",
    "Database Optimization",
    "Cybersecurity & Wireless Pentesting"
  ],
  "philosophy": "Code should solve problems, not create them."
}
```

### 🌐 Connect & Follow
* **Primary GitHub:** [@Gtajisan](https://github.com/Gtajisan)
* **Alternate / Bot GitHub:** [@frnAlt](https://github.com/frnAlt)
* **Highlight Projects:**
  * [FARHAN-Shot-v2](https://github.com/Gtajisan/FARHAN-Shot-v2) — Advanced wireless penetration testing utility.
  * [facebookChatBot](https://github.com/frnAlt/facebookChatBot) — Next-Gen AI Messenger Chatbot Framework.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Runtime** | Node.js (v18+) | Core asynchronous server execution |
| **API Engine** | Custom FCA Wrapper | Facebook Chat API layer with anti-ban jitter queues |
| **Database** | SQLite (`better-sqlite3`) | Long-term memory, chat history & user context |
| **Dashboard** | Express.js + Vanilla CSS | Glassmorphic Web UI & REST API status endpoint |
| **AI Integration**| Pollinations / SimSimi API | Natural conversational intelligence engine |

```text
facebookChatBot/
├── index.js                     # Main bot launcher & event dispatcher
├── config.json                  # Prefix, admin UIDs, and bot settings
├── appState.json                # Facebook session cookies file
├── package.json                 # Project metadata & dependencies
├── README.md                    # Project documentation
├── system/
│   ├── fcaEngine.js             # Rebuilt FCA Engine with anti-ban queues & jitter
│   ├── memory.js                # SQLite long-term conversation memory layer
│   ├── logger.js                # Formatted console logger
│   ├── database.js              # Thread & user JSON state database
│   └── webServer.js             # Express Web Dashboard & API server
├── scripts/
│   ├── cmds/                    # 28 Command modules
│   └── events/                  # 3 Event modules (welcome, leave, antiout)
└── public/                      # Control panel frontend
    ├── index.html               # Tabbed dashboard HTML UI
    └── style.css                # Glassmorphic dark theme stylesheet
```

---

## 🚀 Quick Start & Installation

### 1. Clone & Install
```bash
git clone https://github.com/frnAlt/facebookChatBot.git
cd facebookChatBot
npm install
```

### 2. Configure `config.json`
Set your bot prefix and Admin UIDs:
```json
{
  "botName": "GoatBot v2",
  "prefix": "!",
  "adminUIDs": [
    "100000000000000"
  ],
  "port": 3000
}
```

### 3. Launch Bot
```bash
npm start
```
For automatic development reloading:
```bash
npm run dev
```

---

## 🔐 Session Cookie Setup (`appState.json`)

1. Log into your bot's Facebook account on a browser.
2. Use a cookie exporter extension (such as *c_user & xs exporter*) to extract JSON session cookies.
3. Save your cookies inside `appState.json`:

```json
[
  {
    "key": "c_user",
    "value": "YOUR_FACEBOOK_USER_ID",
    "domain": "facebook.com",
    "path": "/",
    "hostOnly": false,
    "creation": "2026-01-01T00:00:00.000Z",
    "lastAccessed": "2026-01-01T00:00:00.000Z"
  },
  {
    "key": "xs",
    "value": "YOUR_XS_COOKIE_VALUE",
    "domain": "facebook.com",
    "path": "/",
    "hostOnly": false,
    "creation": "2026-01-01T00:00:00.000Z",
    "lastAccessed": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## 🛠️ Developer Module Creation Guide

### How to Create a Custom Command (`/scripts/cmds/mycommand.js`)

```javascript
module.exports = {
  config: {
    name: "mycommand",
    version: "1.0.0",
    author: "Farhan Muh Tasim",
    countDown: 3,
    role: 0, // 0 = Public, 1 = Group Admin, 2 = Bot Admin
    shortDescription: "Custom command example",
    longDescription: "Demonstrates GoatBot v2 lifecycle hooks.",
    category: "Custom",
    guide: "{pn}"
  },

  // 1. Direct Command Invocation (!mycommand)
  onStart: async function ({ api, event, args, message, db, memory, fcaEngine }) {
    return message.reply("Hello from custom GoatBot v2 command!");
  },

  // 2. Passive Message Listener (Runs on every message in chat)
  onChat: async function ({ api, event, message, memory }) {
    if (event.body && event.body.toLowerCase().includes("hello bot")) {
      message.reply("Hello there friend! 👋");
    }
  },

  // 3. Callback Handler for Message Replies
  onReply: async function ({ api, event, message, replyData }) {
    message.reply(`You replied to message: ${replyData.commandName}`);
  }
};
```

### How to Create a Custom Event Handler (`/scripts/events/myevent.js`)

```javascript
module.exports = {
  config: {
    name: "myevent",
    version: "1.0.0",
    author: "Farhan Muh Tasim",
    category: "Events"
  },

  onEvent: async function ({ api, event, logger }) {
    if (event.logMessageType === "log:subscribe") {
      logger.event(`New participant added to thread ${event.threadID}`);
    }
  }
};
```

---

## ⚙️ Command Suite & Event Modules

| Command | Category | Description | Access Level |
| --- | --- | --- | --- |
| `!ai <prompt>` | AI | Natural conversational AI with SQLite memory | Everyone |
| `!group [kick/info/name]` | Admin | Group moderation & title management | Group / Bot Admin |
| `!admin [add/remove/list]` | Admin | Bot Admin authorization management | Bot Admin Only |
| `!kick @mention` | Admin | Quick member removal wrapper | Group Admin |
| `!warn [@mention/reset]` | Admin | Member warning system with auto-kick at 3 warns | Group Admin |
| `!antiout [on/off]` | Admin | Toggle auto re-add antiout protection | Group Admin |
| `!eval <code>` | Admin | Dynamic JavaScript code evaluator | Bot Admin Only |
| `!shell <cmd>` | Admin | Executive terminal shell on host server | Bot Admin Only |
| `!restart` | Admin | Reboots the bot process and reloads modules | Bot Admin Only |
| `!nickname [@tag] <nick>` | FCA Utility | Change thread member nickname | Group Admin |
| `!emoji <emoji>` | FCA Utility | Change thread default reaction emoji | Group Admin |
| `!userinfo [@tag]` | FCA Utility | Fetch Facebook user profile details | Everyone |
| `!thread [info/leave]` | FCA Utility | View thread info or make bot leave group | Group Admin |
| `!say <text>` | Media | Text-to-speech voice note generator | Everyone |
| `!sing <song>` | Media | Search and stream music audio preview | Everyone |
| `!avatar [@tag]` | Utility | Fetch HD Facebook profile picture | Everyone |
| `!weather <city>` | Utility | Live weather report & temperature | Everyone |
| `!quote` | Fun | Random inspirational motivational quotes | Everyone |
| `!daily` | Economy | Claim daily virtual economy coin rewards | Everyone |
| `!rank` | Economy | Check XP level, rank card, and wallet coins | Everyone |
| `!slot <bet>` | Economy | Casino slot machine minigame | Everyone |
| `!help [command]` | System | Interactive command directory & guides | Everyone |
| `!ping` | System | Bot latency and server response time | Everyone |
| `!uptime` | System | Server uptime, Node version, and RAM specs | Everyone |
| `!prefix [newPrefix]` | System | Check or change thread-specific prefix | Everyone |
| `!uid [@tag]` | Utility | Lookup Facebook User ID | Everyone |
| `!tid` | Utility | Get current chat Thread ID | Everyone |
| `!unsend` | Utility | Unsend bot messages via reply | Everyone |

---

## 🛡️ Anti-Ban & Security Safeguards

To maintain account safety and prevent automated restriction flags:
1. **Never Login with Password**: Always use `appState.json` cookies to avoid triggering login challenges.
2. **Jitter Delay Queue**: All outgoing messages pass through an internal queue (`messageQueue`) with randomized 1.2s–3.0s delays.
3. **Typing Status**: Simulates `sendTypingIndicator()` prior to sending messages.
4. **Git Protection**: `appState.json` is listed in `.gitignore` to prevent committing sensitive session tokens to public repositories.

---

## 🌐 Web Dashboard & 24/7 Hosting

`facebookChatBot` includes an Express web server providing a control panel UI at `http://localhost:3000`.

### 24/7 Uptime Keep-Alive
When deploying on **Render**, **Replit**, **Koyeb**, or **VPS**, point a ping service (such as *UptimeRobot*) to:
`https://your-app-domain.com/api/status`

---

## 🐙 GitHub Push Guide

To push updates to your GitHub repository:

```bash
git add .
git commit -m "docs: enhance README with developer module creation guide & system methods"
git push origin main
```

---

## 📜 License & Support

This project is open-source under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ by <strong>Gtajisan</strong> (<a href="https://github.com/Gtajisan">@Gtajisan</a> / <a href="https://github.com/frnAlt">@frnAlt</a>)</sub>
</div>
