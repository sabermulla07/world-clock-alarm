import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag, Clock } from 'lucide-react';
import { soundSynth } from '../utils/soundEffects';

export function StopwatchTimerSection() {
  const [activeTab, setActiveTab] = useState('stopwatch'); // 'stopwatch' | 'timer'

  // ================= STOPWATCH STATE =================
  const [swTime, setSwTime] = useState(0); // in ms
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const swIntervalRef = useRef(null);
  const swStartTimeRef = useRef(0);
  const swAccumulatedRef = useRef(0);

  useEffect(() => {
    if (swRunning) {
      swStartTimeRef.current = performance.now();
      swIntervalRef.current = setInterval(() => {
        const delta = performance.now() - swStartTimeRef.current;
        setSwTime(swAccumulatedRef.current + delta);
      }, 10);
    } else {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    }
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [swRunning]);

  const toggleStopwatch = () => {
    if (swRunning) {
      swAccumulatedRef.current = swTime;
      setSwRunning(false);
    } else {
      setSwRunning(true);
    }
  };

  const resetStopwatch = () => {
    setSwRunning(false);
    setSwTime(0);
    swAccumulatedRef.current = 0;
    setLaps([]);
  };

  const addLap = () => {
    const prevTotal = laps.length > 0 ? laps[0].overallTime : 0;
    const lapDuration = swTime - prevTotal;
    setLaps((prev) => [
      {
        id: prev.length + 1,
        lapTime: lapDuration,
        overallTime: swTime,
      },
      ...prev,
    ]);
  };

  // Format Stopwatch time: MM:SS.cc
  const formatSwTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  // Find fastest and slowest laps
  const fastestLapTime = laps.length > 1 ? Math.min(...laps.map((l) => l.lapTime)) : null;
  const slowestLapTime = laps.length > 1 ? Math.max(...laps.map((l) => l.lapTime)) : null;

  // ================= TIMER STATE =================
  const [timerDuration, setTimerDuration] = useState(5 * 60); // 5 mins in seconds
  const [timerRemaining, setTimerRemaining] = useState(5 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            soundSynth.playAlarm('bell', 0.8);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning]);

  const toggleTimer = () => {
    if (timerRemaining === 0) {
      setTimerRemaining(timerDuration);
    }
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerRemaining(timerDuration);
  };

  const setPreset = (seconds) => {
    setTimerRunning(false);
    setTimerDuration(seconds);
    setTimerRemaining(seconds);
  };

  const formatTimerTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerPercent = timerDuration > 0 ? (timerRemaining / timerDuration) * 100 : 0;

  return (
    <section className="mt-10 glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Timer className="text-cyan-400" size={20} />
          <h3 className="text-xl font-bold text-white tracking-tight">Precision Tools</h3>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('stopwatch')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'stopwatch'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'timer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Countdown Timer
          </button>
        </div>
      </div>

      {/* STOPWATCH TAB */}
      {activeTab === 'stopwatch' && (
        <div className="flex flex-col items-center">
          {/* Main Time Readout */}
          <div className="font-mono-numbers text-5xl sm:text-6xl font-black text-white tracking-wider my-4 drop-shadow-[0_2px_12px_rgba(56,189,248,0.3)]">
            {formatSwTime(swTime)}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 my-4">
            <button
              onClick={toggleStopwatch}
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                swRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {swRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{swRunning ? 'Pause' : 'Start'}</span>
            </button>

            {swRunning && (
              <button
                onClick={addLap}
                className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <Flag size={16} />
                <span>Lap</span>
              </button>
            )}

            <button
              onClick={resetStopwatch}
              disabled={swTime === 0}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="w-full max-w-md mt-4 max-h-52 overflow-y-auto space-y-1.5 border-t border-slate-800/80 pt-4">
              {laps.map((lap) => {
                const isFastest = lap.lapTime === fastestLapTime;
                const isSlowest = lap.lapTime === slowestLapTime;

                return (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg text-xs font-mono-numbers border ${
                      isFastest
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
                        : isSlowest
                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-400'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-semibold">Lap {lap.id}</span>
                    <span className="font-bold">{formatSwTime(lap.lapTime)}</span>
                    <span className="text-slate-500">{formatSwTime(lap.overallTime)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TIMER TAB */}
      {activeTab === 'timer' && (
        <div className="flex flex-col items-center">
          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {[
              { label: '1m', sec: 60 },
              { label: '5m', sec: 300 },
              { label: '15m', sec: 900 },
              { label: '25m (Pomodoro)', sec: 1500 },
              { label: '45m', sec: 2700 },
              { label: '60m', sec: 3600 },
            ].map((p) => (
              <button
                key={p.sec}
                onClick={() => setPreset(p.sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timerDuration === p.sec
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Timer Display with progress bar */}
          <div className="w-full max-w-sm my-3">
            <div className="font-mono-numbers text-6xl font-black text-center text-white tracking-wider my-2">
              {formatTimerTime(timerRemaining)}
            </div>

            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 my-4">
            <button
              onClick={toggleTimer}
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                timerRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {timerRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{timerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
