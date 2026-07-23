import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Wind, Sun, Sunrise, Sunset } from 'lucide-react';
import { DailyData, UnitSystem } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import {
  formatTemp,
  formatDayName,
  formatDateShort,
  formatSpeed,
  formatPrecipitation,
  formatTime,
} from '../utils/unitConversions';

interface SevenDayForecastProps {
  daily?: DailyData;
  unitSystem: UnitSystem;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ daily, unitSystem }) => {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate total week min and max for relative scale bar rendering
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const range = Math.max(1, allMax - allMin);

  const toggleExpand = (idx: number) => {
    setExpandedDayIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            7-Day Daily Forecast
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          High/Low range bars
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {daily.time.map((timeStr, idx) => {
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const code = daily.weather_code[idx];
          const precipSum = daily.precipitation_sum?.[idx] ?? 0;
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const maxWind = daily.wind_speed_10m_max?.[idx] ?? 0;
          const maxUv = daily.uv_index_max?.[idx] ?? 0;
          const sunrise = daily.sunrise?.[idx] ? formatTime(daily.sunrise[idx]) : '--:--';
          const sunset = daily.sunset?.[idx] ? formatTime(daily.sunset[idx]) : '--:--';

          const condition = getWeatherCondition(code);
          const isToday = idx === 0;

          // Calculate bar offsets
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - allMin) / range) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((maxTemp - minTemp) / range) * 100));

          const isExpanded = expandedDayIndex === idx;

          return (
            <div key={timeStr} className="py-3.5 transition-colors">
              <div
                onClick={() => toggleExpand(idx)}
                className="grid grid-cols-12 items-center gap-2 sm:gap-4 cursor-pointer group"
              >
                {/* Day & Date */}
                <div className="col-span-4 sm:col-span-3">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        isToday ? 'text-sky-500' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {formatDayName(timeStr)}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      {formatDateShort(timeStr)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                    {condition.label}
                  </p>
                </div>

                {/* Weather Icon & Rain % */}
                <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                  <span className="text-2xl shrink-0">
                    {condition.category === 'clear' ? '☀️' : condition.category === 'rain' ? '🌧️' : condition.category === 'snow' ? '❄️' : condition.category === 'thunderstorm' ? '⛈️' : '⛅'}
                  </span>
                  {precipProb > 10 && (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                      <Droplets className="w-3 h-3" />
                      {precipProb}%
                    </span>
                  )}
                </div>

                {/* Temperature Min / Bar / Max */}
                <div className="col-span-4 sm:col-span-6 flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 w-10 text-right shrink-0">
                    {formatTemp(minTemp, unitSystem)}
                  </span>

                  {/* Relative Temperature Range Bar */}
                  <div className="relative flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white w-10 text-left shrink-0">
                    {formatTemp(maxTemp, unitSystem)}
                  </span>
                </div>

                {/* Expand Indicator Chevron */}
                <div className="col-span-1 flex justify-end text-slate-400 group-hover:text-sky-500 transition-colors">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" /> Total Precip
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {formatPrecipitation(precipSum, unitSystem)} ({precipProb}% chance)
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-500" /> Max Wind
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {formatSpeed(maxWind, unitSystem)}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> Max UV
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {maxUv.toFixed(1)} / 11+
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sunrise className="w-3.5 h-3.5 text-orange-500" /> Sun Times
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {sunrise} - {sunset}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
