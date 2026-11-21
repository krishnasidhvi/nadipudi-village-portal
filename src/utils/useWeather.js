// Current weather and 3-day forecast for the village, fetched in the browser
// from Open-Meteo (no API key, CC BY 4.0, non-commercial free tier).
// This is a weather-model value for the grid cell covering Nadipudi, not a
// reading from a weather station in the village.

import { useEffect, useState } from "react";

const LAT = 16.6488;
const LON = 81.834;
const CACHE_KEY = "nadipudi_weather_v1";
const CACHE_MINUTES = 30;

const URL =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${LAT}&longitude=${LON}` +
  "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max" +
  "&timezone=Asia%2FKolkata&forecast_days=3";

export const WEATHER_SOURCE = { label: "Open-Meteo", url: "https://open-meteo.com/" };

// WMO weather interpretation codes.
const CONDITIONS = [
  [[0], "☀️", "Clear sky", "నిర్మలమైన ఆకాశం"],
  [[1], "🌤️", "Mainly clear", "ఎక్కువగా నిర్మలం"],
  [[2], "⛅", "Partly cloudy", "పాక్షికంగా మేఘావృతం"],
  [[3], "☁️", "Overcast", "మేఘావృతం"],
  [[45, 48], "🌫️", "Fog", "పొగమంచు"],
  [[51, 53, 55, 56, 57], "🌦️", "Drizzle", "చిరుజల్లులు"],
  [[61, 63, 65, 66, 67], "🌧️", "Rain", "వర్షం"],
  [[71, 73, 75, 77, 85, 86], "🌨️", "Snow", "హిమపాతం"],
  [[80, 81, 82], "🌧️", "Rain showers", "జల్లులు"],
  [[95, 96, 99], "⛈️", "Thunderstorm", "ఉరుములతో కూడిన వర్షం"],
];

export function describeWeather(code, lang) {
  const match = CONDITIONS.find(([codes]) => codes.includes(code));
  if (!match) return { icon: "🌡️", label: lang === "te" ? "వివరాలు లేవు" : "Unknown" };
  return { icon: match[1], label: lang === "te" ? match[3] : match[2] };
}

function readCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.savedAt < CACHE_MINUTES * 60 * 1000) return cached.data;
  } catch {
    // Storage unavailable or corrupt: just fetch.
  }
  return null;
}

function normalise(json) {
  return {
    time: json.current.time,
    temperature: json.current.temperature_2m,
    humidity: json.current.relative_humidity_2m,
    wind: json.current.wind_speed_10m,
    code: json.current.weather_code,
    days: json.daily.time.map((date, i) => ({
      date,
      code: json.daily.weather_code[i],
      max: json.daily.temperature_2m_max[i],
      min: json.daily.temperature_2m_min[i],
      rain: json.daily.precipitation_sum[i],
      rainChance: json.daily.precipitation_probability_max[i],
    })),
  };
}

// Returns { status: "loading" | "ok" | "error", data }.
export function useWeather() {
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached ? { status: "ok", data: cached } : { status: "loading", data: null };
  });

  useEffect(() => {
    if (state.status !== "loading") return;
    const controller = new AbortController();
    fetch(URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const data = normalise(json);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
        } catch {
          // Ignore storage failures.
        }
        setState({ status: "ok", data });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", data: null });
      });
    return () => controller.abort();
  }, [state.status]);

  return state;
}
