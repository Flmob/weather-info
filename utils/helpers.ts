const weatherGradients = {
  // 2xx (Thunderstorm)
  thunderstorm: "#1a1a2e, #16213e, #4b0082",

  // 3xx (Drizzle)
  drizzle: "#4facfe, #00f2fe, #7367f0",

  // 5xx (Rain)
  rain: "#2c3e50, #3498db, #1e3c72",

  // 6xx (Snow)
  snow: "#e6e9f0, #eef1f5, #a1c4fd",

  // 7xx (Mist, Fog, Smoke, etc.)
  atmosphere: "#757f9a, #d7dde8, #95a5a6",

  // 800 (Clear)
  clear: "#56ccf2, #2f80ed, #f2994a",

  // 80x (Clouds)
  clouds: "#bdc3c7, #2c3e50, #7f8c8d",

  default: "#3e5151, #decba4, #3e5151",
};

export const getGradientColors = (id: number) => {
  if (!id) return weatherGradients.default;

  if (id >= 200 && id < 300) return weatherGradients.thunderstorm;
  if (id >= 300 && id < 400) return weatherGradients.drizzle;
  if (id >= 500 && id < 600) return weatherGradients.rain;
  if (id >= 600 && id < 700) return weatherGradients.snow;
  if (id >= 700 && id < 800) return weatherGradients.atmosphere;
  if (id === 800) return weatherGradients.clear;
  if (id > 800 && id < 900) return weatherGradients.clouds;

  return weatherGradients.default;
};
