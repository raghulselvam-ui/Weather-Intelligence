import React from 'react';
import {
  Sparkles,
  Footprints,
  Bike,
  UtensilsCrossed,
  Trees,
  Shirt,
  Layers,
  Umbrella,
  Sun,
  CloudLightning,
  Wind,
  Snowflake,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { PlanningRecommendations as RecommendationsType } from '../types/weather';

interface PlanningRecommendationsProps {
  recommendations: RecommendationsType;
  cityName: string;
}

const iconMap: Record<string, React.ElementType> = {
  Footprints,
  Bike,
  UtensilsCrossed,
  Trees,
  Sparkles,
  Shirt,
  Layers,
  Umbrella,
  Sun,
  CloudLightning,
  Wind,
  Snowflake,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
};

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
  cityName,
}) => {
  const { outdoorScore, overallSummary, activities, clothing, advisories } = recommendations;

  const scoreColor =
    outdoorScore >= 80
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      : outdoorScore >= 60
      ? 'text-sky-500 bg-sky-500/10 border-sky-500/30'
      : outdoorScore >= 40
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-500 bg-rose-500/10 border-rose-500/30';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header & Overall Outdoor Score Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Planning Recommendations
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
                AI Smart Analysis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Practical weather advice, apparel guides, and activity ratings for {cityName}
            </p>
          </div>
        </div>

        {/* Overall Score Badge */}
        <div className={`p-4 rounded-2xl border ${scoreColor} flex items-center gap-4 shrink-0`}>
          <div className="text-center">
            <span className="text-2xl font-black">{outdoorScore}</span>
            <span className="text-xs font-semibold block opacity-80">/ 100</span>
          </div>
          <div className="border-l border-current/20 pl-3">
            <span className="text-xs font-extrabold uppercase tracking-wider block">
              Outdoor Score
            </span>
            <span className="text-xs font-medium opacity-90">
              {outdoorScore >= 80
                ? 'Ideal Outdoor Climate'
                : outdoorScore >= 60
                ? 'Favorable Weather'
                : outdoorScore >= 40
                ? 'Moderate Caution'
                : 'Stay Indoors Advised'}
            </span>
          </div>
        </div>
      </div>

      {/* Weather Advisories & Smart Alerts */}
      {advisories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Weather Advisories & Alerts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advisories.map((advisory) => {
              const AdvisoryIcon = iconMap[advisory.icon] || Info;
              const alertStyle =
                advisory.type === 'alert'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                  : advisory.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                  : advisory.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200';

              return (
                <div
                  key={advisory.id}
                  className={`p-4 rounded-2xl border ${alertStyle} flex items-start gap-3 shadow-2xs`}
                >
                  <AdvisoryIcon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">{advisory.title}</h5>
                    <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                      {advisory.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clothing & Gear Recommendations Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Recommended Outfit & Apparel
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {clothing.type}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {clothing.summary}
        </p>

        {/* Itemized checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {clothing.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outdoor Activity Suitability Meters */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Outdoor Activity Suitability
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activities.map((act) => {
            const ActivityIcon = iconMap[act.icon] || Footprints;
            const ratingBg =
              act.rating === 'Excellent'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                : act.rating === 'Good'
                ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-300'
                : act.rating === 'Moderate'
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300'
                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300';

            const barBg =
              act.score >= 80
                ? 'bg-emerald-500'
                : act.score >= 60
                ? 'bg-sky-500'
                : act.score >= 40
                ? 'bg-amber-500'
                : 'bg-rose-500';

            return (
              <div
                key={act.name}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {act.name}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${ratingBg}`}
                  >
                    {act.rating}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Score</span>
                    <span>{act.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${act.score}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-normal">
                  {act.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
