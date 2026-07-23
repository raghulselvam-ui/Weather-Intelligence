import { LocationResult, WeatherResponse } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export interface ApiError {
  message: string;
  code?: string;
}

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: LocationResult) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
      population: item.population || 0,
    }));
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return [];
    }
    console.error('Error in searchCities:', error);
    throw new Error(`Failed to search cities for "${trimmed}". Please check network connection.`);
  }
}

/**
 * Gets city name for latitude & longitude via free reverse geocoding API
 */
export async function reverseGeocode(lat: number, lon: number): Promise<LocationResult> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const name = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      return {
        id: Math.round(lat * 1000 + lon * 1000),
        name,
        latitude: lat,
        longitude: lon,
        country,
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed, fallback used:', e);
  }

  return {
    id: Date.now(),
    name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    latitude: lat,
    longitude: lon,
    country: 'Current Location',
  };
}

/**
 * Fetches real-time weather, hourly, and 7-day forecast data
 */
export async function getWeatherData(lat: number, lon: number): Promise<WeatherResponse> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      current_weather: 'true',
      hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index,visibility',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${FORECAST_API}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather service HTTP ${response.status}: ${errorText || 'Failed to fetch weather forecast'}`);
    }

    const data: WeatherResponse = await response.json();

    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
      throw new Error('Weather API returned incomplete forecast data.');
    }

    return data;
  } catch (error: unknown) {
    console.error('Error fetching weather data:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while loading weather data.');
  }
}
