import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { SevenDayForecast } from './components/SevenDayForecast';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { SavedLocationsModal } from './components/SavedLocationsModal';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ErrorBanner } from './components/ErrorBanner';

import { LocationResult, WeatherResponse, UnitSystem } from './types/weather';
import { getWeatherData, reverseGeocode } from './services/weatherApi';
import { generateRecommendations } from './utils/recommendationEngine';

// Default initial city: London
const DEFAULT_CITY: LocationResult = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
  admin1: 'England',
};

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      return (localStorage.getItem('weather_unit_system') as UnitSystem) || 'metric';
    } catch {
      return 'metric';
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Saved Favorites Locations State
  const [favorites, setFavorites] = useState<LocationResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  // Fetch weather data for selectedLocation
  const fetchWeather = useCallback(async (loc: LocationResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(loc.latitude, loc.longitude);
      setWeatherData(data);
    } catch (err: unknown) {
      console.error('Weather fetch error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch weather data. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather when location changes
  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation, fetchWeather]);

  // Handle Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loc = await reverseGeocode(lat, lon);
          setSelectedLocation(loc);
        } catch (err) {
          console.warn('Reverse geocode error:', err);
          setSelectedLocation({
            id: Date.now(),
            name: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your current location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or search by city name.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out. Please try searching for your city.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Unit toggle handler
  const handleToggleUnit = (unit: UnitSystem) => {
    setUnitSystem(unit);
    try {
      localStorage.setItem('weather_unit_system', unit);
    } catch (e) {
      console.warn('Failed to save unit setting to localStorage:', e);
    }
  };

  // Favorite toggle handler
  const isCurrentFavorite = favorites.some((f) => f.id === selectedLocation.id);
  const handleToggleFavorite = () => {
    setFavorites((prev) => {
      let updated: LocationResult[];
      if (isCurrentFavorite) {
        updated = prev.filter((item) => item.id !== selectedLocation.id);
      } else {
        updated = [selectedLocation, ...prev];
      }
      try {
        localStorage.setItem('weather_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save favorites to localStorage:', e);
      }
      return updated;
    });
  };

  const handleRemoveFavorite = (cityId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== cityId);
      try {
        localStorage.setItem('weather_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to remove favorite:', e);
      }
      return updated;
    });
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem('weather_favorites');
    } catch (e) {
      console.warn('Failed to clear favorites:', e);
    }
  };

  // Generate recommendations if data is present
  const recommendations = weatherData
    ? generateRecommendations(weatherData, selectedLocation.name)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        unitSystem={unitSystem}
        onToggleUnit={handleToggleUnit}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
        onRefresh={() => fetchWeather(selectedLocation)}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* City Search Bar & Location Actions */}
        <CitySearch
          onSelectCity={(city) => setSelectedLocation(city)}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          selectedCityName={selectedLocation.name}
        />

        {/* Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={() => fetchWeather(selectedLocation)}
            onSelectFallbackCity={(city) => setSelectedLocation(city)}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && <WeatherSkeleton />}

        {/* Main Weather Intelligence View */}
        {!isLoading && weatherData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Primary Current Weather Highlight Card */}
            <CurrentWeatherCard
              weather={weatherData}
              location={selectedLocation}
              unitSystem={unitSystem}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Dynamic Planning Recommendations Card */}
            {recommendations && (
              <PlanningRecommendations
                recommendations={recommendations}
                cityName={selectedLocation.name}
              />
            )}

            {/* 24-Hour Hourly Forecast Timeline */}
            <HourlyForecast
              hourly={weatherData.hourly}
              unitSystem={unitSystem}
            />

            {/* Temperature Trend Analytics Chart */}
            <TemperatureTrendChart
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              unitSystem={unitSystem}
            />

            {/* 7-Day Forecast */}
            <SevenDayForecast
              daily={weatherData.daily}
              unitSystem={unitSystem}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 mt-12 py-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Weather Intelligence. Powered by Open-Meteo API.</p>
          <div className="flex items-center gap-4">
            <span>Free & Open Weather Data</span>
            <span>•</span>
            <span>Client-side Execution</span>
          </div>
        </div>
      </footer>

      {/* Saved Locations Modal */}
      <SavedLocationsModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onSelectCity={(city) => setSelectedLocation(city)}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />
    </div>
  );
}
