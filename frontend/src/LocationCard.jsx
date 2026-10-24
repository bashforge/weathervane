import { useEffect, useState } from "react";
import { describeWeather } from "./weatherCodes.js";

const dropIcon = (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

function dayLabel(date, index) {
  if (index === 0) return "Today";
  // Parse as local midnight so the weekday isn't shifted by the viewer's timezone
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
}

export default function LocationCard({ location, units, onRemove }) {
  const [forecast, setForecast] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setForecast(null);
    setFailed(false);
    async function load() {
      try {
        const response = await fetch(`/api/locations/${location.id}/forecast?units=${units}`);
        if (!response.ok) throw new Error(`status ${response.status}`);
        const data = await response.json();
        if (!ignore) setForecast(data);
      } catch {
        if (!ignore) setFailed(true);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [location.id, units, attempt]);

  return (
    <article className="card">
      <button
        type="button"
        className="card-remove"
        aria-label={`Remove ${location.name}`}
        onClick={() => onRemove(location.id)}
      >
        ×
      </button>
      <h2>{location.name}</h2>
      <p className="card-region">{[location.admin1, location.country].filter(Boolean).join(", ")}</p>

      {failed && (
        <div className="card-status">
          <h3>Failed to load weather data</h3>
          <p>Weather service is temporarily unavailable.</p>
          <button type="button" className="button" onClick={() => setAttempt((a) => a + 1)}>
            Retry
          </button>
        </div>
      )}
      {!failed && !forecast && <p className="card-status">Loading forecast...</p>}
      {forecast && <Forecast forecast={forecast} units={units} />}
    </article>
  );
}

function Forecast({ forecast, units }) {
  const { current, daily } = forecast;
  const weather = describeWeather(current.weather_code, current.is_day);
  const windUnit = units === "imperial" ? "mph" : "km/h";

  return (
    <>
      <div className="current">
        <span className="current-icon" aria-hidden="true">{weather.icon}</span>
        <div>
          <div className="current-temp">{Math.round(current.temperature_2m)}°</div>
          <div className="current-label">{weather.label}</div>
        </div>
        <dl className="current-details">
          <div>
            <dt>Feels like</dt> <dd>{Math.round(current.apparent_temperature)}°</dd>
          </div>
          <div>
            <dt>Humidity</dt> <dd>{current.relative_humidity_2m}%</dd>
          </div>
          <div>
            <dt>Wind</dt> <dd>{Math.round(current.wind_speed_10m)} {windUnit}</dd>
          </div>
        </dl>
      </div>

      <ul className="days">
        {daily.time.map((date, i) => {
          const rain = daily.precipitation_probability_max[i];
          return (
            <li key={date}>
              <span>{dayLabel(date, i)}</span>
              <span className={rain >= 50 ? "chip chip-wet" : "chip"}>
                {dropIcon}
                {rain}%
              </span>
              <span className="day-temps">
                <strong>{Math.round(daily.temperature_2m_max[i])}°</strong> /{" "}
                {Math.round(daily.temperature_2m_min[i])}°
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
