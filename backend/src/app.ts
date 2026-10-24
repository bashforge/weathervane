import express from "express";
import { listLocations, removeLocation, saveLocation } from "./db.ts";

export const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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
