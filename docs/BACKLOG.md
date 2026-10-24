# Backlog

Stories are worked in order and committed to main. Tags: v0.1.0 after WTHR-04,
v0.2.0 after WTHR-10, v1.0.0 after WTHR-13.

## Backend
- [x] WTHR-01 Scaffold: three services (frontend, backend, db) start together.
  - `docker compose up --build` starts all three with no configuration; all report healthy.
  - GET /api/health returns ok; the frontend loads at http://localhost:8080.
- [x] WTHR-02 Save and list locations.
  - POST, GET, and DELETE /api/locations; saving the same coordinates twice returns the existing row.
  - Saved data survives `docker compose restart`.
- [x] WTHR-03 Search places through the backend.
  - GET /api/geocode?q= returns up to 6 matches with name, region, country, and coordinates.
  - Queries under 2 characters return an empty list; Open-Meteo failures return a clear 502.
- [x] WTHR-04 Forecast endpoint.
  - GET /api/locations/:id/forecast?units= returns current conditions plus 7 days.
  - Unknown id returns 404; Open-Meteo failures return a clear 502.

## Frontend
- [x] WTHR-05 UI shell and theme: header, search bar, and empty state; styling through one set of theme tokens.
- [x] WTHR-06 Search and save from the UI: debounced search, results dropdown, choosing a result adds a card without duplicates.
- [x] WTHR-07 Forecast card: current conditions and a 7-day outlook for each saved location.
- [x] WTHR-08 Remove a location: the card disappears immediately and stays gone after a refresh.
- [x] WTHR-09 Temperature unit toggle: °C/°F applies to all cards; the choice persists in the browser.
- [x] WTHR-10 Loading, empty, and error states: one failing card does not affect the others; failed cards offer Retry.

## Quality and documentation
- [x] WTHR-11 Backend tests: a few essential behavior tests (input validation, save and list, duplicate coordinates, delete), run in Docker with `docker compose run --rm backend npm test`.
- [ ] WTHR-12 README: one-command start, architecture, technology choices and trade-offs, how to run tests, AI tools used, configuration overrides, what was left out and next steps.
- [ ] WTHR-13 Fresh-clone verification: clone to a new folder, run `docker compose down -v` then `docker compose up --build`; the page loads, a saved city survives a restart, no configuration needed.