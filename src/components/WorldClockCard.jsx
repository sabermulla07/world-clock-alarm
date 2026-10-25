import React, { memo } from 'react';
import { Sun, Moon, Trash2, ArrowUpRight, Clock, Star } from 'lucide-react';
import { AnalogClock } from './AnalogClock';
import { getTimeInZone, getTimezoneOffsetDetails } from '../constants/timezones';

export const WorldClockCard = memo(function WorldClockCard({
  cityData,
  currentTime,
  is24Hour = false,
  isSmoothSweep = true,
  faceStyle = 'modern',
  theme = 'dark',
  isPrimary = false,
  onRemove,
  onSetPrimary,
}) {
  const actualZone = cityData.timezone === 'local'
    ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
    : cityData.timezone;

  const tz = getTimeInZone(currentTime, actualZone);
  const offset = getTimezoneOffsetDetails(actualZone, currentTime);

  // 12/24 hour display
  let displayHours = tz.hours;
  let ampm = '';
  if (!is24Hour) {
    ampm = displayHours >= 12 ? 'PM' : 'AM';
    displayHours = displayHours % 12 || 12;
  }
  const formattedHours = String(displayHours).padStart(2, '0');
  const formattedMinutes = String(tz.minutes).padStart(2, '0');
  const formattedSeconds = String(tz.seconds).padStart(2, '0');

  // Business hour calculation (9 AM to 5 PM is active business hours)
  const isBusinessHours = tz.hours >= 9 && tz.hours < 17;
  const isEvening = (tz.hours >= 17 && tz.hours < 22) || (tz.hours >= 7 && tz.hours < 9);

  return (
    <div className={`relative group rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
      isPrimary
        ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-900 border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-950/40'
        : 'glass-panel hover:border-slate-600/60 shadow-lg'
    }`}>
      {/* Top Header: City & Region & Actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label={cityData.city}>
              {cityData.flag}
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
              {cityData.city}
            </h3>
            {isPrimary && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Primary
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{cityData.country}</p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {!isPrimary && onSetPrimary && (
            <button
              onClick={() => onSetPrimary(cityData.id)}
              title="Set as Hero Clock"
              aria-label={`Set ${cityData.city} as Hero Clock`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
            >
              <Star size={15} />
            </button>
          )}
          {cityData.id !== 'local' && onRemove && (
            <button
              onClick={() => onRemove(cityData.id)}
              title="Remove city"
              aria-label={`Remove ${cityData.city}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Middle: Mini Analog Clock + Large Digital readout */}
      <div className="flex items-center justify-between my-2 gap-4">
        {/* Digital Time display */}
        <div className="flex-1">
          <div className="flex items-baseline font-mono-numbers">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formattedHours}:{formattedMinutes}
            </span>
            <span className="text-slate-500 text-sm font-light ml-1">:</span>
            <span className="text-slate-400 text-base sm:text-lg font-semibold ml-0.5">
              {formattedSeconds}
            </span>
            {!is24Hour && (
              <span className="text-xs font-bold text-indigo-400 ml-2 tracking-wider">
                {ampm}
              </span>
            )}
          </div>

          {/* Time difference and business status */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center text-[11px] font-mono-numbers px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-300">
              {offset.relativeDiff}
            </span>

            {/* Business Hour Indicator */}
            {isBusinessHours && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Business
              </span>
            )}
            {isEvening && !isBusinessHours && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Evening
              </span>
            )}
            {!isBusinessHours && !isEvening && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/40">
                Night / Closed
              </span>
            )}
          </div>
        </div>

        {/* Mini Analog Clock face */}
        <div className="shrink-0 flex items-center justify-center p-1 bg-slate-900/60 rounded-full border border-slate-800/60 shadow-inner">
          <AnalogClock
            hours={tz.hours}
            minutes={tz.minutes}
            seconds={tz.seconds}
            milliseconds={tz.milliseconds}
            isSmooth={isSmoothSweep}
            faceStyle={faceStyle}
            theme={theme}
            size={100}
            showNumbers={false}
          />
        </div>
      </div>

      {/* Footer Details: Day/Night + UTC */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          {tz.isDaytime ? (
            <Sun size={13} className="text-amber-400" />
          ) : (
            <Moon size={13} className="text-indigo-400" />
          )}
          <span>{tz.isDaytime ? 'Daylight' : 'Night'}</span>
        </div>

        <span className="font-mono-numbers text-[11px] text-slate-400">
          {offset.offsetString}
        </span>
      </div>
    </div>
  );
});
