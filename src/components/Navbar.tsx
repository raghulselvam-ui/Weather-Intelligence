import React from 'react';
import { CloudSun, Bookmark, RefreshCw, Compass } from 'lucide-react';
import { UnitSystem } from '../types/weather';

interface NavbarProps {
  unitSystem: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unitSystem,
  onToggleUnit,
  favoritesCount,
  onOpenFavorites,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                Weather Intelligence
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Real-time forecasts & planning recommendations
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh current weather"
            id="btn-refresh-weather"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Saved Locations / Favorites */}
          <button
            onClick={onOpenFavorites}
            id="btn-open-favorites"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <span className="hidden xs:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-sky-500 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Unit Toggle Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onToggleUnit('metric')}
              id="unit-metric-toggle"
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °C, km/h
            </button>
            <button
              onClick={() => onToggleUnit('imperial')}
              id="unit-imperial-toggle"
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °F, mph
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
