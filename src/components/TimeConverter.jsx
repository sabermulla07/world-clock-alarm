import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, RotateCcw, Clock, Sun, Moon } from 'lucide-react';
import { WORLD_TIMEZONES, getTimeInZone, getTimezoneOffsetDetails } from '../constants/timezones';

export const TimeConverter = function TimeConverter({
  pinnedCityIds = [],
  currentTime,
  is24Hour = false,
}) {
  // Offset in hours from current live time (0 = live, +3 = 3 hours in future, etc.)
  const [sliderMinutesOffset, setSliderMinutesOffset] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Compute converted simulated time
  const targetDate = useMemo(() => {
    if (sliderMinutesOffset === 0) return currentTime;
    return new Date(currentTime.getTime() + sliderMinutesOffset * 60 * 1000);
  }, [currentTime, sliderMinutesOffset]);

  const pinnedCities = useMemo(() => {
    return pinnedCityIds
      .map((id) => WORLD_TIMEZONES.find((c) => c.id === id))
      .filter(Boolean);
  }, [pinnedCityIds]);

  const handleReset = () => {
    setSliderMinutesOffset(0);
    setIsScrubbing(false);
  };

  const hoursDiff = (sliderMinutesOffset / 60).toFixed(1);

  return (
    <section className="mt-10 glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Interactive Time Zone Converter & Meeting Planner
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Scrub forward or backward in time to align schedules, meetings, and market hours across all your pinned cities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sliderMinutesOffset !== 0 && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
            >
              <RotateCcw size={14} />
              Reset to Live Time
            </button>
          )}
          <span className={`px-2.5 py-1 rounded-md text-xs font-mono-numbers font-medium ${
            sliderMinutesOffset === 0 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {sliderMinutesOffset === 0 ? 'LIVE SYNC' : `${sliderMinutesOffset > 0 ? '+' : ''}${hoursDiff} hrs`}
          </span>
        </div>
      </div>

      {/* Scrub Slider */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono-numbers">
          <span>-12h</span>
          <span className="text-indigo-400 font-semibold">
            {sliderMinutesOffset === 0 ? 'Now (Live Time)' : `Simulated: ${sliderMinutesOffset > 0 ? '+' : ''}${hoursDiff}h`}
          </span>
          <span>+12h</span>
        </div>
        <input
          type="range"
          min="-720"
          max="720"
          step="15"
          value={sliderMinutesOffset}
          onChange={(e) => {
            setSliderMinutesOffset(parseInt(e.target.value, 10));
            setIsScrubbing(true);
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Earlier today</span>
          <span>Timeline Scrubber (15m increments)</span>
          <span>Later / Tomorrow</span>
        </div>
      </div>

      {/* Converted Time Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pinnedCities.map((city) => {
          const actualZone = city.timezone === 'local'
            ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
            : city.timezone;
          const tz = getTimeInZone(targetDate, actualZone);

          let displayHours = tz.hours;
          let ampm = '';
          if (!is24Hour) {
            ampm = displayHours >= 12 ? 'PM' : 'AM';
            displayHours = displayHours % 12 || 12;
          }
          const formattedHours = String(displayHours).padStart(2, '0');
          const formattedMinutes = String(tz.minutes).padStart(2, '0');
          const isBusinessHours = tz.hours >= 9 && tz.hours < 17;

          return (
            <div
              key={city.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isBusinessHours
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span>{city.flag}</span>
                  <span>{city.city}</span>
                </span>
                {tz.isDaytime ? (
                  <Sun size={13} className="text-amber-400" />
                ) : (
                  <Moon size={13} className="text-indigo-400" />
                )}
              </div>

              <div className="flex items-baseline justify-between mt-2 font-mono-numbers">
                <div className="text-xl font-bold text-white">
                  {formattedHours}:{formattedMinutes}
                  {!is24Hour && <span className="text-xs text-indigo-400 ml-1 font-semibold">{ampm}</span>}
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  isBusinessHours
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isBusinessHours ? 'Business' : 'Off-hours'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
