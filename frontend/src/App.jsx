import { useEffect, useState } from "react";
import LocationCard from "./LocationCard.jsx";
import SearchBox from "./SearchBox.jsx";

const pinIcon = (
  <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
    <path
      d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="2" fill="currentColor" />
  </svg>
);

export default function App() {
  const [locations, setLocations] = useState([]);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((response) => (response.ok ? response.json() : []))
      .then(setLocations)
      .catch(() => {});
  }, []);

  async function handleSelect(place) {
    const { name, admin1, country, latitude, longitude, timezone } = place;
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, admin1, country, latitude, longitude, timezone }),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const saved = await response.json();
      // Saving a place twice returns the existing row, so match on id
      setLocations((prev) => (prev.some((l) => l.id === saved.id) ? prev : [saved, ...prev]));
      setSaveError(false);
      return true;
    } catch {
      setSaveError(true);
      return false;
    }
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <span className="app-name">Weathervane</span>
          <div className="unit-toggle" role="group" aria-label="Temperature unit">
            <button type="button" aria-pressed="true" aria-label="Celsius">°C</button>
            <button type="button" aria-pressed="false" aria-label="Fahrenheit">°F</button>
          </div>
        </div>
      </header>

      <main className="container">
        {saveError && (
          <div className="banner" role="alert">
            <span>Failed to save city. Please try again.</span>
            <button type="button" aria-label="Dismiss" onClick={() => setSaveError(false)}>
              ×
            </button>
          </div>
        )}

        <SearchBox onSelect={handleSelect} />

        {locations.length === 0 ? (
          <section className="empty">
            <div className="empty-icon">{pinIcon}</div>
            <h2>Add your first city</h2>
            <p>Search above to save it and see its live forecast.</p>
          </section>
        ) : (
          <section className="cards">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} units="metric" />
            ))}
          </section>
        )}
      </main>

      <footer className="footer">
        Weather data by <a href="https://open-meteo.com/">Open-Meteo.com</a>
      </footer>
    </>
  );
}
