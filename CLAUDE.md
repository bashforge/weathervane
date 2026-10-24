Weathervane: multi-location weather forecast app.

Stack: React 19 + Vite (JavaScript), Express 5 (TypeScript, run directly by Node 24),
PostgreSQL 18, nginx, Docker Compose.
Ports: 8080 public (frontend), 3001 internal (backend), 5432 internal (db).

Conventions
- Pin exact dependency versions.
- The frontend never calls Open-Meteo directly; all weather data goes through the backend.
- No secrets and no .env file. Configuration defaults live in docker-compose.yml and can be
  overridden from the shell, e.g. `FRONTEND_PORT=9090 docker compose up --build`.
- Everything runs in Docker; run tests with `docker compose run --rm backend npm test`.
- Backend TypeScript: strict, simple, no enums; `import type` for types; `.ts` extensions in
  relative imports; `tsc --noEmit` must pass.
- Small, readable code.

Workflow
- Stories WTHR-01..13 in docs/BACKLOG.md, worked in order and committed to main.
- Commit format: "WTHR-<nn>: <short description>". Tests pass before commit.
- Milestone tags: v0.1.0 (backend), v0.2.0 (UI), v1.0.0 (final).
- Definition of done: `docker compose up --build` works from a fresh clone with no
  configuration and no host Node, and the frontend loads at http://localhost:8080.