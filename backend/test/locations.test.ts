import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { app } from "../src/app.ts";
import { createTable, pool } from "../src/db.ts";

// Distinctive coordinates, so the tests never touch the developer's saved cities.
const latitude = 1.2345;
const longitude = 2.3456;
const city = { name: "Test City", latitude, longitude };

type Location = { id: number; latitude: number; longitude: number };

let server: Server;
let base: string;

async function list(): Promise<Location[]> {
  const response = await fetch(`${base}/api/locations`);
  return response.json();
}

async function save(body: unknown) {
  return fetch(`${base}/api/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function removeTestRows() {
  for (const row of await list()) {
    if (row.latitude === latitude && row.longitude === longitude) {
      await fetch(`${base}/api/locations/${row.id}`, { method: "DELETE" });
    }
  }
}

before(async () => {
  await createTable();
  server = app.listen(0);
  await once(server, "listening");
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
  // Leftovers from an earlier run that failed midway
  await removeTestRows();
});

after(async () => {
  await removeTestRows();
  server.close();
  await pool.end();
});

test("rejects bad input with 400", async () => {
  assert.equal((await save({ ...city, name: "" })).status, 400);
  assert.equal((await save({ ...city, latitude: "1.2345" })).status, 400);
  assert.equal((await save({ ...city, latitude: 95 })).status, 400);
  const noBody = await fetch(`${base}/api/locations`, { method: "POST" });
  assert.equal(noBody.status, 400);
});

test("saves a location and lists it", async () => {
  const response = await save(city);
  assert.equal(response.status, 201);
  const saved: Location = await response.json();
  assert.ok((await list()).some((row) => row.id === saved.id));
});

test("saving the same coordinates twice returns the same id", async () => {
  const first: Location = await (await save(city)).json();
  const second: Location = await (await save(city)).json();
  assert.equal(second.id, first.id);
  const matches = (await list()).filter((row) => row.id === first.id);
  assert.equal(matches.length, 1);
});

test("deletes a location", async () => {
  const saved: Location = await (await save(city)).json();
  const url = `${base}/api/locations/${saved.id}`;
  assert.equal((await fetch(url, { method: "DELETE" })).status, 204);
  assert.ok(!(await list()).some((row) => row.id === saved.id));
  assert.equal((await fetch(url, { method: "DELETE" })).status, 404);
  assert.equal((await fetch(`${base}/api/locations/abc`, { method: "DELETE" })).status, 400);
});
