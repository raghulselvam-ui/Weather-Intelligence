import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-3xl bg-slate-200/80 dark:bg-slate-800 p-8 h-80 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded-md" />
          </div>
          <div className="h-10 w-10 bg-slate-300 dark:bg-slate-700 rounded-2xl" />
        </div>

        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-slate-300 dark:bg-slate-700 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-12 w-36 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-300/80 dark:bg-slate-700/60 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className="rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 p-6 h-48 space-y-4">
        <div className="h-6 w-40 bg-slate-300 dark:bg-slate-700 rounded-md" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 w-24 bg-slate-300/70 dark:bg-slate-700/70 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 p-6 h-64 space-y-4">
        <div className="h-6 w-52 bg-slate-300 dark:bg-slate-700 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-slate-300/70 dark:bg-slate-700/70 rounded-2xl" />
          <div className="h-40 bg-slate-300/70 dark:bg-slate-700/70 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
