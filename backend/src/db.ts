import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS locations (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name text NOT NULL,
      admin1 text,
      country text,
      latitude double precision NOT NULL,
      longitude double precision NOT NULL,
      timezone text,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (latitude, longitude)
    )
  `);
}

export async function listLocations() {
  const result = await pool.query("SELECT * FROM locations ORDER BY id");
  return result.rows;
}

export async function saveLocation(
  name: string,
  admin1: string | null,
  country: string | null,
  latitude: number,
  longitude: number,
  timezone: string | null,
) {
  // The no-op update makes RETURNING give back the existing row on a duplicate.
  const result = await pool.query(
    `INSERT INTO locations (name, admin1, country, latitude, longitude, timezone)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (latitude, longitude) DO UPDATE SET name = locations.name
     RETURNING *`,
    [name, admin1, country, latitude, longitude, timezone],
  );
  return result.rows[0];
}

export async function getLocation(id: number) {
  const result = await pool.query(
    "SELECT name, latitude, longitude FROM locations WHERE id = $1",
    [id],
  );
  return result.rows[0];
}

export async function removeLocation(id: number) {
  const result = await pool.query("DELETE FROM locations WHERE id = $1", [id]);
  return result.rowCount! > 0;
}
