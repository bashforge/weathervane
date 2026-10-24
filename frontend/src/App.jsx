const searchIcon = (
  <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="m20 20-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

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
        <div className="search">
          {searchIcon}
          <input type="search" aria-label="Search for a city" placeholder="Search for a city..." />
        </div>

        <section className="empty">
          <div className="empty-icon">{pinIcon}</div>
          <h2>Add your first city</h2>
          <p>Search above to save it and see its live forecast.</p>
        </section>
      </main>

      <footer className="footer">
        Weather data by <a href="https://open-meteo.com/">Open-Meteo.com</a>
      </footer>
    </>
  );
}
