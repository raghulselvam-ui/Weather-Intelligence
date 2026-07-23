import { UnitSystem } from '../types/weather';

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

export function formatTemp(tempC: number, unit: UnitSystem): string {
  if (tempC === undefined || tempC === null || isNaN(tempC)) return '--°';
  const value = unit === 'imperial' ? celsiusToFahrenheit(tempC) : tempC;
  return `${Math.round(value)}°${unit === 'imperial' ? 'F' : 'C'}`;
}

export function formatTempBare(tempC: number, unit: UnitSystem): number {
  if (tempC === undefined || tempC === null || isNaN(tempC)) return 0;
  const value = unit === 'imperial' ? celsiusToFahrenheit(tempC) : tempC;
  return Math.round(value);
}

export function formatSpeed(speedKmh: number, unit: UnitSystem): string {
  if (speedKmh === undefined || speedKmh === null || isNaN(speedKmh)) return '--';
  if (unit === 'imperial') {
    return `${Math.round(kmhToMph(speedKmh))} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function formatPrecipitation(mm: number, unit: UnitSystem): string {
  if (mm === undefined || mm === null || isNaN(mm)) return '0 mm';
  if (unit === 'imperial') {
    const inches = mm / 25.4;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatDayName(dateStr: string, isShort = false): string {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: isShort ? 'short' : 'long',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return timeStr;
  }
}

export function getWindDirectionLabel(degree: number): string {
  if (degree === undefined || degree === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUVRating(uvIndex: number): { label: string; color: string } {
  if (uvIndex === undefined || uvIndex === null) return { label: 'Low', color: 'text-emerald-500' };
  if (uvIndex <= 2) return { label: 'Low', color: 'text-emerald-500' };
  if (uvIndex <= 5) return { label: 'Moderate', color: 'text-amber-500' };
  if (uvIndex <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { label: 'Very High', color: 'text-rose-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
}
