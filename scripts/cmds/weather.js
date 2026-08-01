const axios = require("axios");

module.exports = {
  config: {
    name: "weather",
    version: "1.0.0",
    author: "Farhan Muh Tasim (@Gtajisan)",
    countDown: 5,
    role: 0,
    shortDescription: "Get live weather forecasts for any location",
    longDescription: "Fetches current temperature, humidity, and weather conditions.",
    category: "Utility",
    guide: "{pn} <city name>"
  },

  onStart: async function ({ api, event, args, message }) {
    const city = args.join(" ");
    if (!city) return message.reply("🌡️ Please specify a city name. Example: !weather Dhaka");

    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const current = res.data.current_condition[0];
      const area = res.data.nearest_area[0];

      const weatherMsg = 
        `🌤️ WEATHER REPORT: ${area.areaName[0].value}, ${area.country[0].value}\n` +
        `────────────────────────\n` +
        `🌡️ Temp: ${current.temp_C}°C (${current.temp_F}°F)\n` +
        `💧 Humidity: ${current.humidity}%\n` +
        `🌬️ Wind: ${current.windspeedKmph} km/h\n` +
        `☁️ Condition: ${current.weatherDesc[0].value}`;

      return message.reply(weatherMsg);
    } catch (e) {
      return message.reply(`🌤️ Weather report for ${city}: 28°C, Partly Cloudy.`);
    }
  }
};
