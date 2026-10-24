import { useEffect, useState } from "react";

const searchIcon = (
  <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="m20 20-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const pinIcon = (
  <svg className="result-pin" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setFailed(false);
      return;
    }
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        if (!response.ok) throw new Error(`status ${response.status}`);
        const data = await response.json();
        if (ignore) return;
        setResults(data);
        setFailed(false);
      } catch {
        if (!ignore) setFailed(true);
      }
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  function clear() {
    setQuery("");
  }

  async function choose(place) {
    if (await onSelect(place)) clear();
  }

  return (
    <div className="search-area">
      <div className="search">
        {searchIcon}
        <input
          type="text"
          aria-label="Search for a city"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && clear()}
        />
        {query && (
          <button type="button" className="search-clear" aria-label="Clear search" onClick={clear}>
            ×
          </button>
        )}
      </div>

      {failed && <div className="dropdown dropdown-message">Search is unavailable. Try again.</div>}
      {!failed && results?.length === 0 && (
        <div className="dropdown dropdown-message">No places found.</div>
      )}
      {!failed && results?.length > 0 && (
        <div className="dropdown">
          <div className="dropdown-header">
            <span>Matching locations</span>
            <span>{results.length} {results.length === 1 ? "result" : "results"}</span>
          </div>
          <ul>
            {results.map((place) => (
              <li key={`${place.latitude},${place.longitude}`}>
                <button type="button" className="result" onClick={() => choose(place)}>
                  {pinIcon}
                  <strong>{place.name}</strong>
                  <span className="result-region">
                    {[place.admin1, place.country].filter(Boolean).join(", ")}
                  </span>
                  <span className="result-select">Select</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
