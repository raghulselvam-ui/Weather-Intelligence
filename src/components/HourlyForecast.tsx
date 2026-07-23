import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyData, UnitSystem } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTemp, formatTime } from '../utils/unitConversions';

interface HourlyForecastProps {
  hourly?: HourlyData;
  unitSystem: UnitSystem;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unitSystem }) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Get next 24 hours starting from current hour
  const now = new Date();
  const startIndex = hourly.time.findIndex((t) => new Date(t) >= now) || 0;
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            24-Hour Hourly Forecast
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Scroll horizontally →
        </span>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {next24Hours.map((timeStr, idx) => {
          const actualIdx = startIndex + idx;
          const temp = hourly.temperature_2m[actualIdx];
          const code = hourly.weather_code[actualIdx];
          const precipProb = hourly.precipitation_probability[actualIdx] ?? 0;
          const condition = getWeatherCondition(code);
          const isCurrent = idx === 0;

          return (
            <div
              key={timeStr}
              className={`flex-none w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between gap-2 snap-start border transition-all ${
                isCurrent
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {isCurrent ? 'Now' : formatTime(timeStr).split(':')[0] + ' ' + formatTime(timeStr).slice(-2)}
              </span>

              {/* Weather Condition Icon */}
              <div className={`p-2 rounded-xl ${isCurrent ? 'bg-white/20' : 'bg-white dark:bg-slate-700 shadow-2xs'}`}>
                <span className="text-xl">
                  {condition.category === 'clear' ? '☀️' : condition.category === 'rain' ? '🌧️' : condition.category === 'snow' ? '❄️' : condition.category === 'thunderstorm' ? '⛈️' : '⛅'}
                </span>
              </div>

              {/* Temperature */}
              <span className="text-base font-extrabold tracking-tight">
                {formatTemp(temp, unitSystem)}
              </span>

              {/* Rain Chance % */}
              {precipProb > 5 ? (
                <div
                  className={`flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  <Droplets className="w-3 h-3" />
                  <span>{precipProb}%</span>
                </div>
              ) : (
                <div className="h-5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
