import React from 'react';
import { AlertTriangle, RefreshCw, Search, MapPin } from 'lucide-react';
import { LocationResult } from '../types/weather';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onSelectFallbackCity?: (city: LocationResult) => void;
}

const DEFAULT_FALLBACKS: LocationResult[] = [
  { id: 1, name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: 2, name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: 3, name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { id: 4, name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
];

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onSelectFallbackCity,
}) => {
  return (
    <div className="rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 shadow-sm space-y-4 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/20 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1 flex-1">
          <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
            Weather Service Error
          </h3>
          <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed max-w-2xl">
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            id="btn-error-retry"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      {/* Suggested Popular Cities Fallback */}
      {onSelectFallbackCity && (
        <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
          <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 mb-2">
            Try searching for one of these major global cities instead:
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {DEFAULT_FALLBACKS.map((city) => (
              <button
                key={city.name}
                onClick={() => onSelectFallbackCity(city)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-medium hover:border-rose-400 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{city.name} ({city.country})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
