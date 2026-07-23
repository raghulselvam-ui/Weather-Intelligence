import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Bookmark,
  MapPin,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { WeatherResponse, LocationResult, UnitSystem } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import {
  formatTemp,
  formatSpeed,
  getWindDirectionLabel,
  getUVRating,
  formatTime,
  formatPrecipitation,
} from '../utils/unitConversions';

interface CurrentWeatherCardProps {
  weather: WeatherResponse;
  location: LocationResult;
  unitSystem: UnitSystem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

// Icon mapper for Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  location,
  unitSystem,
  isFavorite,
  onToggleFavorite,
}) => {
  const current = weather.current || {
    temperature_2m: weather.current_weather?.temperature || 0,
    apparent_temperature: weather.current_weather?.temperature || 0,
    relative_humidity_2m: 50,
    wind_speed_10m: weather.current_weather?.windspeed || 0,
    wind_direction_10m: weather.current_weather?.winddirection || 0,
    weather_code: weather.current_weather?.weathercode || 0,
    is_day: weather.current_weather?.is_day ?? 1,
    cloud_cover: 20,
    pressure_msl: 1013,
    precipitation: 0,
  };

  const code = current.weather_code;
  const condition = getWeatherCondition(code);
  const IconComponent = iconMap[condition.iconName] || Cloud;

  const daily = weather.daily;
  const highTemp = daily?.temperature_2m_max?.[0] ?? current.temperature_2m;
  const lowTemp = daily?.temperature_2m_min?.[0] ?? current.temperature_2m;
  const maxUV = daily?.uv_index_max?.[0] ?? current.uv_index ?? 3;
  const uvInfo = getUVRating(maxUV);
  const precipProb = daily?.precipitation_probability_max?.[0] ?? 0;
  const sunriseTime = daily?.sunrise?.[0] ? formatTime(daily.sunrise[0]) : '--:--';
  const sunsetTime = daily?.sunset?.[0] ? formatTime(daily.sunset[0]) : '--:--';

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${condition.cardTheme} bg-gradient-to-br ${condition.bgGradient} p-6 sm:p-8 shadow-xl transition-all duration-300`}
    >
      {/* Top Bar: Location Title & Favorite Toggle */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {location.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {[location.admin1, location.country].filter(Boolean).join(', ')} • {dateStr}
          </p>
        </div>

        <button
          onClick={onToggleFavorite}
          id="btn-toggle-favorite"
          title={isFavorite ? 'Remove from saved locations' : 'Save this location'}
          className={`p-2.5 rounded-2xl border transition-all ${
            isFavorite
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-500 hover:border-amber-300'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center Main Temperature & Visual Icon Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4 border-y border-slate-200/60 dark:border-slate-800/60 my-4">
        {/* Left Column: Temperature & High/Low */}
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/80 shadow-md backdrop-blur-sm shrink-0">
            <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 text-sky-500" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {formatTemp(current.temperature_2m, unitSystem)}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-slate-400" />
              Feels like <span className="font-bold">{formatTemp(current.apparent_temperature ?? current.temperature_2m, unitSystem)}</span>
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm font-semibold">
              <span className="text-rose-500 dark:text-rose-400 flex items-center gap-0.5">
                ▲ {formatTemp(highTemp, unitSystem)}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-sky-500 dark:text-sky-400 flex items-center gap-0.5">
                ▼ {formatTemp(lowTemp, unitSystem)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Condition Banner & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-bold bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white shadow-xs">
            <span>{condition.label}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {condition.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <Sunrise className="w-4 h-4 text-amber-500" /> {sunriseTime}
            <span className="mx-1">•</span>
            <Sunset className="w-4 h-4 text-orange-500" /> {sunsetTime}
          </div>
        </div>
      </div>

      {/* Bottom Grid: 6 Key Parameter Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {/* Wind Speed & Compass */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Wind className="w-4 h-4 text-sky-500" />
            <span>Wind</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {formatSpeed(current.wind_speed_10m, unitSystem)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Dir: {getWindDirectionLabel(current.wind_direction_10m)} ({current.wind_direction_10m}°)
          </p>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Humidity</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {current.relative_humidity_2m}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {current.relative_humidity_2m > 75 ? 'Humid' : current.relative_humidity_2m < 30 ? 'Dry air' : 'Comfortable'}
          </p>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Max UV Index</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {maxUV.toFixed(1)}
          </p>
          <p className={`text-xs font-bold mt-0.5 ${uvInfo.color}`}>
            {uvInfo.label}
          </p>
        </div>

        {/* Pressure */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Gauge className="w-4 h-4 text-teal-500" />
            <span>Pressure</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {Math.round(current.pressure_msl)} hPa
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {current.pressure_msl > 1013 ? 'High pressure' : 'Low pressure'}
          </p>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Cloud className="w-4 h-4 text-slate-400" />
            <span>Cloud Cover</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {current.cloud_cover}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {current.cloud_cover > 80 ? 'Overcast' : current.cloud_cover > 30 ? 'Partly cloudy' : 'Clear sky'}
          </p>
        </div>

        {/* Precip Probability */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <CloudRain className="w-4 h-4 text-indigo-500" />
            <span>Rain Chance</span>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {precipProb}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {precipProb > 50 ? 'Rain likely' : precipProb > 20 ? 'Slight chance' : 'Low rain risk'}
          </p>
        </div>
      </div>
    </div>
  );
};
