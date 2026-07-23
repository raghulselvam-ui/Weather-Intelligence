import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, History, Compass, Globe2 } from 'lucide-react';
import { LocationResult } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface CitySearchProps {
  onSelectCity: (city: LocationResult) => void;
  onUseCurrentLocation: () => void;
  isLocating?: boolean;
  selectedCityName?: string;
}

const POPULAR_CITIES: { name: string; country: string; lat: number; lon: number }[] = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
];

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating = false,
  selectedCityName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<LocationResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced city search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const cities = await searchCities(trimmed, controller.signal);
        setResults(cities);
        setIsOpen(true);
        if (cities.length === 0) {
          setSearchError(`No cities found matching "${trimmed}". Try another location.`);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setSearchError('Search failed. Please check your network connection.');
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (city: LocationResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);

    // Save to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id);
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recent search to localStorage:', e);
      }
      return updated;
    });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={dropdownRef}>
      {/* Search Bar Input & Current Location Button */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city, state, or country (e.g. Tokyo, Munich, Chicago)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />

          {query && (
            <button
              onClick={handleClear}
              id="btn-clear-search"
              title="Clear search input"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Location Geolocation Button */}
        <button
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          id="btn-use-location"
          title="Use current geolocation"
          className="flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm shadow-md shadow-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all disabled:opacity-50 shrink-0"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Compass className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (query.trim().length >= 2 || recentSearches.length > 0) && (
        <div className="absolute z-40 mt-1 w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 max-h-80 overflow-y-auto">
          {/* Active Search Results */}
          {query.trim().length >= 2 && (
            <div>
              <div className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span>Matching Locations ({results.length})</span>
                {isSearching && <span className="text-sky-500 font-normal">Searching...</span>}
              </div>

              {searchError ? (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 italic">
                  {searchError}
                </div>
              ) : results.length > 0 ? (
                <ul className="py-1">
                  {results.map((city) => (
                    <li key={`${city.id}-${city.latitude}-${city.longitude}`}>
                      <button
                        onClick={() => handleSelect(city)}
                        id={`city-option-${city.id}`}
                        className="w-full text-left px-4 py-2.5 hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              {city.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                              {[city.admin1, city.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {/* Recent Searches */}
          {query.trim().length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Searches</span>
              </div>
              <ul className="py-1">
                {recentSearches.map((city) => (
                  <li key={`recent-${city.id}`}>
                    <button
                      onClick={() => handleSelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {city.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({city.country})
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Popular Cities Quick Select Pills */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Globe2 className="w-3.5 h-3.5" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() =>
              handleSelect({
                id: Math.round(city.lat * 100 + city.lon * 100),
                name: city.name,
                country: city.country,
                latitude: city.lat,
                longitude: city.lon,
              })
            }
            id={`popular-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              selectedCityName?.toLowerCase() === city.name.toLowerCase()
                ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:text-sky-600 dark:hover:text-sky-400'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
