import React from 'react';
import { Bookmark, MapPin, X, Trash2, ArrowRight } from 'lucide-react';
import { LocationResult } from '../types/weather';

interface SavedLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: LocationResult[];
  onSelectCity: (city: LocationResult) => void;
  onRemoveFavorite: (cityId: number) => void;
  onClearAll: () => void;
}

export const SavedLocationsModal: React.FC<SavedLocationsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Saved Locations ({favorites.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No saved locations yet
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the bookmark icon on any city weather card to save it here for instant 1-click access.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((city) => (
                <div
                  key={`fav-${city.id}`}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-sky-300 dark:hover:border-sky-700 flex items-center justify-between gap-3 transition-colors group"
                >
                  <button
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className="flex-1 text-left flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                        {city.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      title="View weather"
                      className="p-2 rounded-xl text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(city.id)}
                      title="Remove from saved"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {favorites.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Clear All Saved
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
