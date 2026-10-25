import React from 'react';
import { AnalogClock } from './AnalogClock';
import { DigitalClock } from './DigitalClock';
import { Sliders, Volume2, VolumeX, Sparkles, Clock, Compass } from 'lucide-react';
import { getTimeInZone } from '../constants/timezones';

export function HeroClockSection({
  currentTime,
  smoothTime,
  primaryCity,
  faceStyle,
  setFaceStyle,
  isSmoothSweep,
  setIsSmoothSweep,
  is24Hour,
  setIs24Hour,
  showSeconds,
  setShowSeconds,
  showMilliseconds,
  setShowMilliseconds,
  tickSoundEnabled,
  setTickSoundEnabled,
  theme,
}) {
  const actualZone = primaryCity.timezone === 'local'
    ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
    : primaryCity.timezone;

  // We compute hours and minutes for target zone
  const tz = getTimeInZone(currentTime, actualZone);

  // If smooth sweep is on, use fractional sweep seconds
  const currentSeconds = isSmoothSweep ? smoothTime.seconds : tz.seconds;
  const currentMs = isSmoothSweep ? smoothTime.milliseconds : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800/80 p-6 sm:p-10 shadow-2xl">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Dual Clock Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Analog Clock Display */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative p-3 rounded-full bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-md">
            <AnalogClock
              hours={tz.hours}
              minutes={tz.minutes}
              seconds={currentSeconds}
              milliseconds={currentMs}
              isSmooth={isSmoothSweep}
              faceStyle={faceStyle}
              theme={theme}
              size={290}
              showNumbers={true}
              label={primaryCity.city}
            />
          </div>

          {/* Quick Style Switcher Pills below analog clock */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Compass size={12} /> Style:
            </span>
            {[
              { id: 'modern', label: 'Modern' },
              { id: 'classic', label: 'Roman' },
              { id: 'chronograph', label: 'Chrono' },
              { id: 'minimal', label: 'Bauhaus' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setFaceStyle(style.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  faceStyle === style.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Digital Clock & Dynamic Controls */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left justify-center">
          {/* Primary City Digital Readout */}
          <DigitalClock
            currentTime={currentTime}
            timezone={actualZone}
            timezoneName={primaryCity.city}
            is24Hour={is24Hour}
            showSeconds={showSeconds}
            showMilliseconds={showMilliseconds}
            size="large"
            onToggle1224={() => setIs24Hour(!is24Hour)}
          />

          {/* Quick Control Toggles Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs">
            {/* Smooth Sweep vs Tick Toggle */}
            <button
              onClick={() => setIsSmoothSweep(!isSmoothSweep)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                isSmoothSweep
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>{isSmoothSweep ? 'Continuous Sweep' : 'Discrete Tick'}</span>
            </button>

            {/* 12H / 24H Toggle */}
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                is24Hour
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <Clock size={13} />
              <span>{is24Hour ? '24-Hour Format' : '12-Hour AM/PM'}</span>
            </button>

            {/* Show Seconds Toggle */}
            <button
              onClick={() => setShowSeconds(!showSeconds)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer ${
                showSeconds
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Seconds {showSeconds ? 'ON' : 'OFF'}
            </button>

            {/* Tick Audio Sound Toggle */}
            <button
              onClick={() => setTickSoundEnabled(!tickSoundEnabled)}
              title="Subtle clock tick audio sound"
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                tickSoundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {tickSoundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>Tick Sound {tickSoundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
