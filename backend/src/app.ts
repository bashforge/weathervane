import express from "express";
import { getLocation, listLocations, removeLocation, saveLocation } from "./db.ts";

export const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

type GeocodeResult = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

app.get("/api/geocode", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (q.length < 2) {
    res.json([]);
    return;
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`;
  let data: { results?: GeocodeResult[] };
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`status ${response.status}`);
    data = await response.json();
  } catch {
    res.status(502).json({ error: "geocoding service unavailable" });
    return;
  }
  // Open-Meteo omits "results" entirely when nothing matches
  res.json(
    (data.results ?? []).map(({ name, admin1, country, latitude, longitude, timezone }) => ({
      name,
      admin1,
      country,
      latitude,
      longitude,
      timezone,
    })),
  );
});

app.get("/api/locations", async (_req, res) => {
  res.json(await listLocations());
});

function inRange(value: unknown, limit: number) {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit;
}

app.post("/api/locations", async (req, res) => {
  const body = req.body ?? {};
  const { name, admin1, country, latitude, longitude, timezone } = body;
  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "name is required" });
    return;
  }
  if (!inRange(latitude, 90) || !inRange(longitude, 180)) {
    res.status(400).json({ error: "latitude and longitude must be valid coordinates" });
    return;
  }
  const location = await saveLocation(
    name,
    admin1 ?? null,
    country ?? null,
    latitude,
    longitude,
    timezone ?? null,
  );
  res.status(201).json(location);
});

app.delete("/api/locations/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "id must be a positive integer" });
    return;
  }
  if (!(await removeLocation(id))) {
    res.status(404).json({ error: "location not found" });
    return;
  }
  res.status(204).end();
});

app.get("/api/locations/:id/forecast", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "id must be a positive integer" });
    return;
  }
  const location = await getLocation(id);
  if (!location) {
    res.status(404).json({ error: "location not found" });
    return;
  }
  let url =
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
    "&timezone=auto&forecast_days=7" +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max";
  if (req.query.units === "imperial") {
    url += "&temperature_unit=fahrenheit&wind_speed_unit=mph";
  }
  let data: { current: unknown; daily: unknown };
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`status ${response.status}`);
    data = await response.json();
  } catch {
    res.status(502).json({ error: "forecast service unavailable" });
    return;
  }
  res.json({ name: location.name, current: data.current, daily: data.daily });
});
