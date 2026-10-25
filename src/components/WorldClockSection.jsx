import React, { useState, useMemo } from 'react';
import { Globe, Plus, Search, X, Check, MapPin } from 'lucide-react';
import { WorldClockCard } from './WorldClockCard';
import { WORLD_TIMEZONES } from '../constants/timezones';

export const WorldClockSection = function WorldClockSection({
  pinnedCityIds = [],
  currentTime,
  is24Hour = false,
  isSmoothSweep = true,
  faceStyle = 'modern',
  theme = 'dark',
  primaryCityId,
  onAddCity,
  onRemoveCity,
  onSetPrimaryCity,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Filter pinned city objects
  const pinnedCities = useMemo(() => {
    return pinnedCityIds
      .map((id) => WORLD_TIMEZONES.find((c) => c.id === id))
      .filter(Boolean);
  }, [pinnedCityIds]);

  // Modal available cities list (excluding already pinned ones)
  const availableCities = useMemo(() => {
    return WORLD_TIMEZONES.filter((city) => {
      const isAlreadyPinned = pinnedCityIds.includes(city.id);
      if (isAlreadyPinned) return false;

      const matchesSearch =
        city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.timezone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [pinnedCityIds, searchQuery, selectedRegion]);

  const regions = ['All', 'Americas', 'Europe', 'Asia', 'Middle East', 'Oceania', 'Africa'];

  return (
    <section className="mt-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="text-indigo-400" size={22} />
            <h2 className="text-2xl font-bold text-white tracking-tight">World Clock Network</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-region synchronized time tracking across global financial and tech hubs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add City</span>
          </button>
        </div>
      </div>

      {/* Grid of Pinned World Clocks */}
      {pinnedCities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <Globe className="mx-auto text-slate-600 mb-3" size={40} />
          <h3 className="text-lg font-semibold text-slate-300">No time zones pinned</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Click the "Add City" button to monitor time across global cities like London, Tokyo, and New York.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
          >
            Browse Cities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pinnedCities.map((city) => (
            <WorldClockCard
              key={city.id}
              cityData={city}
              currentTime={currentTime}
              is24Hour={is24Hour}
              isSmoothSweep={isSmoothSweep}
              faceStyle={faceStyle}
              theme={theme}
              isPrimary={city.id === primaryCityId}
              onRemove={onRemoveCity}
              onSetPrimary={onSetPrimaryCity}
            />
          ))}
        </div>
      )}

      {/* Add City Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-400" />
                  Add World City
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a timezone to add to your live dashboard
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input & Region Tabs */}
            <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/50">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by city, country, or timezone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />
              </div>

              {/* Region Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedRegion === region
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* City List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {availableCities.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  {searchQuery ? 'No matching cities found.' : 'All available cities are already added!'}
                </div>
              ) : (
                availableCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => {
                      onAddCity(city.id);
                      setIsModalOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800/80 hover:border-indigo-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{city.flag}</span>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors text-sm">
                          {city.city}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {city.country} • <span className="font-mono-numbers">{city.timezone}</span>
                        </p>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
