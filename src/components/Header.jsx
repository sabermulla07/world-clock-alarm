import React from 'react';
import { Clock, Globe, Bell, Settings, Maximize2, Minimize2, Sparkles, Volume2 } from 'lucide-react';
import { soundSynth } from '../utils/soundEffects';

export function Header({
  activeAlarmCount = 0,
  pinnedCount = 0,
  onOpenSettings,
  isFullscreen,
  toggleFullscreen,
  theme,
  setTheme,
}) {
  const toggleTheme = () => {
    const cycle = { dark: 'neon', neon: 'gold', gold: 'light', light: 'dark' };
    setTheme(cycle[theme] || 'dark');
  };

  return (
    <header className="py-4 border-b border-slate-800/80 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white font-sans">
                CHRONOS
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Precision Real-Time World Clock & Dashboard
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Alarms pill */}
          <div
            title={`${activeAlarmCount} active alarms`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
          >
            <Bell size={13} className={activeAlarmCount > 0 ? 'text-rose-400' : 'text-slate-500'} />
            <span className="hidden sm:inline">Alarms:</span>
            <span className={`font-mono-numbers font-bold ${activeAlarmCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {activeAlarmCount}
            </span>
          </div>

          {/* Pinned Cities count */}
          <div
            title={`${pinnedCount} world cities monitored`}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
          >
            <Globe size={13} className="text-indigo-400" />
            <span>Cities:</span>
            <span className="font-mono-numbers font-bold text-indigo-400">{pinnedCount}</span>
          </div>

          {/* Quick Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={`Current theme: ${theme}. Click to switch.`}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-indigo-400" />
            <span className="hidden sm:inline capitalize">{theme}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Dashboard Settings"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
