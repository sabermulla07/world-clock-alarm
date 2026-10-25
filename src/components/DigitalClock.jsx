import React from 'react';
import { Sun, Moon, Calendar, Globe, Clock, Zap } from 'lucide-react';
import { getTimeInZone, getTimezoneOffsetDetails } from '../constants/timezones';

export function DigitalClock({
  currentTime,
  timezone = 'local',
  timezoneName = 'Local Time',
  is24Hour = false,
  showSeconds = true,
  showMilliseconds = false,
  size = 'large', // 'large' (hero) | 'medium' (card) | 'small'
  onToggle1224,
}) {
  const actualTimezone = timezone === 'local' 
    ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC') 
    : timezone;

  const tzData = getTimeInZone(currentTime, actualTimezone);
  const offsetDetails = getTimezoneOffsetDetails(actualTimezone, currentTime);

  // Formatting hours
  let displayHours = tzData.hours;
  let ampm = '';
  if (!is24Hour) {
    ampm = displayHours >= 12 ? 'PM' : 'AM';
    displayHours = displayHours % 12 || 12;
  }
  const formattedHours = String(displayHours).padStart(2, '0');
  const formattedMinutes = String(tzData.minutes).padStart(2, '0');
  const formattedSeconds = String(tzData.seconds).padStart(2, '0');
  const formattedMs = String(Math.floor(tzData.milliseconds / 10)).padStart(2, '0');

  // Formatted date string
  const dateObj = new Date(currentTime.toLocaleString('en-US', { timeZone: actualTimezone }));
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDayYear = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate day of year and week number
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((dateObj - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay()) / 7);

  if (size === 'small') {
    return (
      <div className="flex items-baseline space-x-1.5 font-mono-numbers text-sm font-semibold">
        <span className="text-white">{formattedHours}:{formattedMinutes}</span>
        {showSeconds && <span className="text-slate-400 text-xs">:{formattedSeconds}</span>}
        {!is24Hour && <span className="text-[10px] text-indigo-400 font-bold ml-1">{ampm}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* City & Zone pill */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300 shadow-sm backdrop-blur">
          <Globe size={13} className="text-indigo-400" />
          <span>{timezoneName}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono-numbers">{offsetDetails.offsetString}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/60 border border-slate-700/40 text-slate-300">
          {tzData.isDaytime ? (
            <Sun size={12} className="text-amber-400 fill-amber-400/20" />
          ) : (
            <Moon size={12} className="text-indigo-400 fill-indigo-400/20" />
          )}
          <span>{tzData.isDaytime ? 'Daytime' : 'Night'}</span>
        </span>
      </div>

      {/* Main Digital Numbers Display */}
      <div className="flex items-baseline justify-center select-none font-mono-numbers tracking-tight">
        {/* Hours & Minutes */}
        <div className="flex items-center text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-[0_4px_16px_rgba(99,102,241,0.25)]">
          <span className="bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
            {formattedHours}
          </span>
          <span className="mx-1 text-indigo-400 animate-pulse">:</span>
          <span className="bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
            {formattedMinutes}
          </span>
        </div>

        {/* Seconds */}
        {showSeconds && (
          <div className="flex items-baseline ml-2">
            <span className="text-slate-500 font-light text-3xl sm:text-4xl">:</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-indigo-400 ml-0.5">
              {formattedSeconds}
            </span>
          </div>
        )}

        {/* Milliseconds (if enabled) */}
        {showMilliseconds && (
          <span className="text-xs sm:text-sm font-medium text-slate-500 ml-1.5 tabular-nums">
            .{formattedMs}
          </span>
        )}

        {/* AM/PM indicator */}
        {!is24Hour && (
          <button
            onClick={onToggle1224}
            title="Click to toggle 12h / 24h format"
            className="ml-3 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all cursor-pointer shadow-sm"
          >
            {ampm}
          </button>
        )}
        {is24Hour && (
          <button
            onClick={onToggle1224}
            title="Click to toggle 12h / 24h format"
            className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 transition-all cursor-pointer"
          >
            24H
          </button>
        )}
      </div>

      {/* Date & Calendar Info */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Calendar size={14} className="text-indigo-400" />
          <span>{weekday},</span>
          <span className="text-white font-semibold">{monthDayYear}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>•</span>
          <span className="font-mono-numbers">Day {dayOfYear}</span>
          <span>•</span>
          <span className="font-mono-numbers">Week {weekNumber}</span>
        </div>
      </div>
    </div>
  );
}
