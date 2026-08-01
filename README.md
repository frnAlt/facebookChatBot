# 🤖 GoatBot v2 — Open-Source Messenger Chatbot & Safe FCA Architecture

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Architecture: GoatBot v2](https://img.shields.io/badge/Architecture-GoatBot_v2-blue.svg)](#architecture)
[![Dashboard](https://img.shields.io/badge/Dashboard-Express_UI-purple.svg)](#web-dashboard)

A modular, automated, and AI-powered Facebook Messenger Chatbot built on **Node.js**, **GoatBot v2** architecture, and a rebuilt **Safe FCA Engine Wrapper** featuring anti-ban jitter queues, typing emulation, SQLite long-term conversation memory, and an interactive Web Dashboard.

---

## 👨💻 Developer & Author Info

```json
{
  "developer": "Farhan Muh Tasim",
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

### 🌐 GitHub Profiles
- **Primary Profile:** [@Gtajisan](https://github.com/Gtajisan)
- **Alternate / Bot Profile:** [@frnAlt](https://github.com/frnAlt)

---

## 🌟 Architecture & Safety Highlights

- 🛡️ **Safe FCA Engine Wrapper (`fcaEngine.js`)**: Humanized message queue (`messageQueue`) with randomized 1.2s–3.0s delays to prevent account rate-limit flags.
- ⌨️ **Typing Status Emulation**: Automatically triggers `sendTypingIndicator()` before responding to simulate genuine human activity.
- 🧠 **Long-Term SQLite Memory (`memory.js`)**: Stores past thread interactions, user context history, and custom profile notes to provide human-like AI responses.
- 🔐 **Session Cookie Persistence**: Automatically updates and saves refreshed session state to `appState.json`.
- 🌐 **Web Control Panel**: Real-time Express dashboard displaying registered commands, active thread memory, system metrics, and author details.
- ⚡ **Modular Event & Command System**: Hot-loadable modules in `/scripts/cmds` and `/scripts/events` supporting `onStart`, `onChat`, and `onEvent` hooks.

---

## 📂 Codebase Layout

```text
facebookChatBot/
├── index.js                     # Main bot launcher & event dispatcher
├── config.json                  # Prefix, admin UIDs, and bot settings
├── appState.json                # Facebook session cookies
├── package.json                 # Project metadata & dependencies
├── README.md                    # Detailed documentation
├── system/
│   ├── fcaEngine.js             # Rebuilt FCA Engine with anti-ban queues & jitter
│   ├── memory.js                # SQLite long-term conversation memory layer
│   ├── logger.js                # Formatted console logger
│   ├── database.js              # Thread & user JSON state database
│   └── webServer.js             # Express Web Dashboard & API server
├── scripts/
│   ├── cmds/                    # Command modules
│   │   ├── ai.js                # Human-like AI responder with SQLite memory
│   │   ├── group.js             # Group maintenance & moderation (kick, info, name)
│   │   ├── help.js              # Command list & detailed guide
│   │   ├── ping.js              # Latency test
│   │   ├── uptime.js            # System memory & uptime status
│   │   ├── prefix.js            # Per-thread prefix setting
│   │   ├── uid.js               # User Facebook ID lookup
│   │   ├── tid.js               # Thread ID lookup
│   │   ├── unsend.js            # Unsend bot message via reply
│   │   └── shell.js             # Admin executive terminal shell
│   └── events/                  # Event modules
│       ├── welcome.js           # Group welcome event handler
│       └── leave.js             # Member departure event handler
└── public/                      # Control panel frontend
    ├── index.html               # Tabbed dashboard HTML UI
    └── style.css                # Glassmorphic dark theme stylesheet
```

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
git clone https://github.com/frnAlt/facebookChatBot.git
cd facebookChatBot
npm install
```

### 2. Configure Session Cookies (`appState.json`)
Export your account session cookies into `appState.json`:
```json
[
  {
    "key": "c_user",
    "value": "100000000000000",
    "domain": "facebook.com",
    "path": "/"
  },
  {
    "key": "xs",
    "value": "YOUR_XS_COOKIE_TOKEN",
    "domain": "facebook.com",
    "path": "/"
  }
]
```

### 3. Launch the Bot
```bash
npm start
```
View the dashboard live at `http://localhost:3000`.

---

## 🐙 Push to GitHub Guide

To publish your project to GitHub under your profile:

```bash
git add .
git commit -m "feat: complete GoatBot v2 safe FCA engine, AI memory, and web dashboard"
git branch -M main
git remote add origin https://github.com/frnAlt/facebookChatBot.git
git push -u origin main
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
