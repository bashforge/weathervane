# Weathervane

A small web app for looking up cities and viewing the weather forecast for them.
Weather and location search data come from [Open-Meteo](https://open-meteo.com/), a free API
that needs no key. Weather and geocoding data come from
[Open-Meteo](https://open-meteo.com/) (free, no API key).

## Features

- Search for a city by name; results show the region and country
- Save multiple locations, with no duplicates; the list persists across page reloads and restarts
- Current conditions per location: temperature, feels like, humidity, wind
- 7-day outlook with daily high and low and chance of precipitation
- Remove a saved location
- °C / °F toggle, remembered in the browser
- Loading, empty and error states, with Retry on a failed forecast
- Responsive layout

## Quick start

Prerequisites: Docker with Compose v2 (macOS or Ubuntu).

    docker compose up --build -d

The app is served at http://localhost:8080. Not using `.env` file, host Node installation or manual setup is
required.

    docker compose down       # stop, keep saved cities
    docker compose down -v    # stop and delete saved cities

## Configuration

The published port defaults to 8080 and can be overridden:

    FRONTEND_PORT=9090 docker compose up --build

Saved cities are stored in the `pgdata` volume and survive `docker compose restart` and
`docker compose down`.

## Stack

| Service  | Technology                                   | Role                                         |
|----------|----------------------------------------------|----------------------------------------------|
| frontend | React 19, Vite (JavaScript), nginx           | Serves the UI and proxies `/api` to backend  |
| backend  | Node 24, Express 5, TypeScript, `pg`         | REST API, calls Open-Meteo                   |
| db       | PostgreSQL 18                                | Stores saved locations                       |

Only the frontend port is published. The browser never calls Open-Meteo directly.

PostgreSQL is the data layer: it runs as its own container with data on a named volume, and a unique
constraint on (latitude, longitude) keeps one row per place.

## Tests

    docker compose run --build --rm backend npm test

The backend tests cover the locations API: input validation, save and list, saving the same
coordinates twice, and delete. They use the Compose database but only create and remove their own
rows.

## AI tooling

- Google Stitch: UI design (screens, loading, empty and error states, theme).
- Claude Code (VS Code): Standard claude practices for development. Conventions are in `CLAUDE.md` and the stories in
  `docs/BACKLOG.md`. Each story was planned first, then implemented, then verified against the running
  stack. It was also used to work out the Open-Meteo request and response formats. Commits were
  made by me.

## Discussion topics
I'd like to talk about these topics on our next follow up discussion:

- Tech stack: why and trade-offs
- Architecture and request flow
- Testing approach
- Deferred work: What else I would do next if not short on time (caching and timeouts for Open-Meteo calls, browser geolocation,
  broader tests, frontend polish, production readiness)
- Use of AI tools and Practices