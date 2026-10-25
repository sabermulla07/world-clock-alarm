import React, { useEffect } from 'react';
import { Bell, BellOff, Clock, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AlarmModal({ alarm, onDismiss, onSnooze }) {
  useEffect(() => {
    // Launch celebratory confetti pulse when alarm fires
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore confetti issues if canvas not supported
    }
  }, []);

  if (!alarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden alarm-ringing-pulse">
        {/* Animated Background Ring */}
        <div className="absolute inset-0 bg-rose-500/10 pointer-events-none animate-pulse"></div>

        {/* Bell Icon with animation */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mb-5 shadow-lg shadow-rose-500/30">
          <Bell className="w-10 h-10 text-rose-400 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
          </span>
        </div>

        {/* Alarm Header */}
        <div className="space-y-1 mb-6">
          <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
            Alarm Alert
          </span>
          <h2 className="text-4xl sm:text-5xl font-mono-numbers font-black text-white tracking-tight">
            {alarm.time}
          </h2>
          <h3 className="text-lg font-semibold text-slate-200 mt-2">
            {alarm.label || 'Alarm Notification'}
          </h3>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <Volume2 size={13} className="text-rose-400 animate-pulse" />
            <span>Tone: {alarm.sound || 'Standard'} (Playing)</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onSnooze(alarm.snoozeMinutes || 5)}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Clock size={16} />
            <span>Snooze (+{alarm.snoozeMinutes || 5}m)</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <BellOff size={16} />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
}
