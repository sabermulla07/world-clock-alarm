import React from 'react';
import { X, Settings, Palette, Volume2, Clock, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
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
  isFullscreen,
  toggleFullscreen,
  onResetDefaults,
}) {
  if (!isOpen) return null;

  const themes = [
    { id: 'dark', label: 'Obsidian Slate', preview: 'bg-slate-900 border-indigo-500' },
    { id: 'neon', label: 'Cyberpunk Neon', preview: 'bg-cyan-950 border-cyan-400' },
    { id: 'gold', label: 'Imperial Gold', preview: 'bg-amber-950 border-amber-400' },
    { id: 'light', label: 'Clean Frost', preview: 'bg-slate-100 border-slate-400 text-slate-800' },
  ];

  const faceStyles = [
    { id: 'modern', label: 'Modern Dial' },
    { id: 'classic', label: 'Classic Roman' },
    { id: 'chronograph', label: 'Chronograph' },
    { id: 'minimal', label: 'Bauhaus Minimal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings size={20} className="text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Dashboard Settings & Controls</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Theme Palette */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              <Palette size={14} className="text-indigo-400" />
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold text-white">{t.label}</span>
                  <span className={`w-5 h-5 rounded-full border-2 ${t.preview}`}></span>
                </button>
              ))}
            </div>
          </div>

          {/* Analog Face Style */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              <Clock size={14} className="text-indigo-400" />
              Analog Face Style
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {faceStyles.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFaceStyle(f.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    faceStyle === f.id
                      ? 'border-indigo-500 bg-indigo-950/40 text-white font-bold'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Display & Precision Controls */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Display & Motion Preferences
            </label>
            <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
              {/* 24-Hour Format */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">24-Hour Format</div>
                  <div className="text-[11px] text-slate-400">Display military time (14:00 vs 2:00 PM)</div>
                </div>
                <button
                  onClick={() => setIs24Hour(!is24Hour)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    is24Hour ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is24Hour ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Show Seconds */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                <div>
                  <div className="text-xs font-semibold text-white">Show Seconds</div>
                  <div className="text-[11px] text-slate-400">Display live seconds counter</div>
                </div>
                <button
                  onClick={() => setShowSeconds(!showSeconds)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showSeconds ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showSeconds ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Milliseconds */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                <div>
                  <div className="text-xs font-semibold text-white">High Precision Milliseconds</div>
                  <div className="text-[11px] text-slate-400">Display hundredths of a second</div>
                </div>
                <button
                  onClick={() => setShowMilliseconds(!showMilliseconds)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showMilliseconds ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showMilliseconds ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Smooth Sweep */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                <div>
                  <div className="text-xs font-semibold text-white">Smooth Continuous Hand Sweep</div>
                  <div className="text-[11px] text-slate-400">60 FPS fluid analog movement</div>
                </div>
                <button
                  onClick={() => setIsSmoothSweep(!isSmoothSweep)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isSmoothSweep ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSmoothSweep ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Tick Sound */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                <div>
                  <div className="text-xs font-semibold text-white">Mechanical Clock Tick Sound</div>
                  <div className="text-[11px] text-slate-400">Subtle synthesized second tick</div>
                </div>
                <button
                  onClick={() => setTickSoundEnabled(!tickSoundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tickSoundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tickSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={toggleFullscreen}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
            </button>

            <button
              onClick={onResetDefaults}
              className="py-2.5 px-3 rounded-xl border border-slate-700/60 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
