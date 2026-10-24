// Open-Meteo WMO weather codes
const weatherCodes = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Fog", icon: "🌫️" },
  51: { label: "Drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Drizzle", icon: "🌦️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Freezing drizzle", icon: "🌧️" },
  61: { label: "Rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Freezing rain", icon: "🌧️" },
  71: { label: "Snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Snow", icon: "🌨️" },
  77: { label: "Snow grains", icon: "🌨️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Rain showers", icon: "🌦️" },
  82: { label: "Rain showers", icon: "🌦️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Thunderstorm with hail", icon: "⛈️" },
};

export function describeWeather(code, isDay) {
  const weather = weatherCodes[code] ?? { label: "Unknown", icon: "🌡️" };
  if (isDay === 0 && (code === 0 || code === 1)) {
    return { ...weather, icon: "🌙" };
  }
  return weather;
}
