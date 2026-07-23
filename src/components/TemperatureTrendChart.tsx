import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { DailyData, HourlyData, UnitSystem } from '../types/weather';
import { formatTempBare, formatDayName, formatTime } from '../utils/unitConversions';

interface TemperatureTrendChartProps {
  daily?: DailyData;
  hourly?: HourlyData;
  unitSystem: UnitSystem;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({
  daily,
  hourly,
  unitSystem,
}) => {
  const [activeTab, setActiveTab] = useState<'7day' | 'hourly'>('7day');

  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Prepare 7-day trend data
  const dailyData = daily.time.map((timeStr, idx) => ({
    day: formatDayName(timeStr, true),
    fullDate: timeStr,
    High: formatTempBare(daily.temperature_2m_max[idx], unitSystem),
    Low: formatTempBare(daily.temperature_2m_min[idx], unitSystem),
    Precipitation: daily.precipitation_sum?.[idx] ?? 0,
  }));

  // Prepare 24-hour hourly trend data
  const now = new Date();
  const startIndex = hourly?.time ? Math.max(0, hourly.time.findIndex((t) => new Date(t) >= now)) : 0;
  const hourlySlice = hourly?.time ? hourly.time.slice(startIndex, startIndex + 24) : [];

  const hourlyData = hourlySlice.map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    return {
      time: idx === 0 ? 'Now' : formatTime(timeStr).split(':')[0] + ' ' + formatTime(timeStr).slice(-2),
      Temp: formatTempBare(hourly?.temperature_2m[actualIdx] ?? 0, unitSystem),
      RainChance: hourly?.precipitation_probability[actualIdx] ?? 0,
    };
  });

  const unitLabel = unitSystem === 'imperial' ? '°F' : '°C';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      {/* Chart Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Weather Visual Trends & Analytics
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('7day')}
            id="tab-7day-chart"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === '7day'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> 7-Day High/Low Trend
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            id="tab-hourly-chart"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hourly'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> 24-Hour Temp & Rain
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === '7day' ? (
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="highTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="lowTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit={unitLabel} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '13px',
                }}
                formatter={(value: number, name: string) => [`${value}${unitLabel}`, name]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="High"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#highTempGrad)"
              />
              <Area
                type="monotone"
                dataKey="Low"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#lowTempGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit={unitLabel} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#3b82f6' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar yAxisId="right" dataKey="RainChance" name="Rain Chance (%)" fill="#3b82f6" opacity={0.4} radius={[4, 4, 0, 0]} />
              <Area yAxisId="left" type="monotone" dataKey="Temp" name={`Temp (${unitLabel})`} stroke="#38bdf8" strokeWidth={3} fill="none" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
