import React, { useState } from 'react';
import { Bell, Plus, Trash2, Volume2, Clock, Check, X, Play } from 'lucide-react';
import { soundSynth } from '../utils/soundEffects';

const SOUND_OPTIONS = [
  { id: 'electronic', label: 'Electronic Beep' },
  { id: 'marimba', label: 'Marimba Melodic' },
  { id: 'cosmic', label: 'Cosmic Synth' },
  { id: 'bell', label: 'Resonant Bell' },
  { id: 'radar', label: 'Classic Digital' },
];

const DAYS_OF_WEEK = [
  { label: 'S', day: 0, title: 'Sunday' },
  { label: 'M', day: 1, title: 'Monday' },
  { label: 'T', day: 2, title: 'Tuesday' },
  { label: 'W', day: 3, title: 'Wednesday' },
  { label: 'T', day: 4, title: 'Thursday' },
  { label: 'F', day: 5, title: 'Friday' },
  { label: 'S', day: 6, title: 'Saturday' },
];

export function AlarmSection({
  alarms = [],
  currentTime,
  is24Hour = false,
  onAddAlarm,
  onToggleAlarm,
  onDeleteAlarm,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newLabel, setNewLabel] = useState('');
  const [newSound, setNewSound] = useState('electronic');
  const [newRepeatDays, setNewRepeatDays] = useState([1, 2, 3, 4, 5]); // default Mon-Fri
  const [newSnoozeMinutes, setNewSnoozeMinutes] = useState(5);

  const handlePreviewSound = (soundId) => {
    soundSynth.playAlarm(soundId, 0.7);
  };

  const handleCreateAlarm = (e) => {
    e.preventDefault();
    if (!newTime) return;

    onAddAlarm({
      time: newTime,
      label: newLabel.trim() || 'Alarm',
      sound: newSound,
      repeatDays: newRepeatDays,
      snoozeMinutes: Number(newSnoozeMinutes),
    });

    setIsModalOpen(false);
    setNewLabel('');
  };

  const toggleDay = (dayIndex) => {
    setNewRepeatDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  // Calculate time remaining until next ring
  const getTimeRemaining = (alarmTime, repeatDays) => {
    if (!currentTime) return '';
    const [targetH, targetM] = alarmTime.split(':').map(Number);
    const nowH = currentTime.getHours();
    const nowM = currentTime.getMinutes();

    let diffMinutes = targetH * 60 + targetM - (nowH * 60 + nowM);
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60; // Next day
    }

    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    if (hrs === 0) return `in ${mins}m`;
    return `in ${hrs}h ${mins}m`;
  };

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="text-rose-400" size={22} />
            <h2 className="text-2xl font-bold text-white tracking-tight">Smart Alarms & Reminders</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Audio synthesized alarms with custom frequencies, multi-tone options, and snooze controls.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>New Alarm</span>
        </button>
      </div>

      {/* Alarms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alarms.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
            <Bell className="mx-auto text-slate-600 mb-2" size={32} />
            <p>No alarms configured. Click "New Alarm" to add one.</p>
          </div>
        ) : (
          alarms.map((alarm) => {
            const timeParts = alarm.time.split(':');
            let displayH = parseInt(timeParts[0], 10);
            let ampm = '';
            if (!is24Hour) {
              ampm = displayH >= 12 ? 'PM' : 'AM';
              displayH = displayH % 12 || 12;
            }
            const formattedTime = !is24Hour
              ? `${String(displayH).padStart(2, '0')}:${timeParts[1]}`
              : alarm.time;

            return (
              <div
                key={alarm.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                  alarm.enabled
                    ? 'glass-panel border-slate-700/60 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800/40 opacity-60'
                }`}
              >
                {/* Alarm Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 font-mono-numbers">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {formattedTime}
                    </span>
                    {!is24Hour && (
                      <span className="text-xs font-bold text-rose-400">{ampm}</span>
                    )}
                    {alarm.enabled && (
                      <span className="text-xs text-slate-400 font-mono font-medium ml-2">
                        {getTimeRemaining(alarm.time, alarm.repeatDays)}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-200 truncate mt-1">
                    {alarm.label}
                  </div>

                  {/* Days pill row & tone */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {DAYS_OF_WEEK.map((d) => {
                        const isDayActive = alarm.repeatDays && alarm.repeatDays.includes(d.day);
                        return (
                          <span
                            key={d.day}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isDayActive
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'text-slate-600'
                            }`}
                          >
                            {d.label}
                          </span>
                        );
                      })}
                    </div>

                    <span className="text-slate-600">•</span>

                    {/* Preview sound button */}
                    <button
                      onClick={() => handlePreviewSound(alarm.sound)}
                      title={`Preview tone: ${alarm.sound}`}
                      className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Volume2 size={12} />
                      <span className="capitalize">{alarm.sound || 'Default'}</span>
                    </button>
                  </div>
                </div>

                {/* Right controls: Enable Switch & Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleAlarm(alarm.id)}
                    aria-label={`Toggle alarm for ${alarm.time}`}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      alarm.enabled ? 'bg-rose-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alarm.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteAlarm(alarm.id)}
                    title="Delete alarm"
                    aria-label={`Delete alarm for ${alarm.time}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Alarm Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell size={18} className="text-rose-400" />
                Add New Alarm
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAlarm} className="p-5 space-y-4">
              {/* Time Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Alarm Time (24H Format)
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-2xl font-mono-numbers text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily Standup, Market Open, Coffee..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Sound Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Sound Tone
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePreviewSound(newSound)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Play size={12} fill="currentColor" /> Preview Sound
                  </button>
                </div>
                <select
                  value={newSound}
                  onChange={(e) => setNewSound(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {SOUND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Repeat Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Repeat Days
                </label>
                <div className="flex items-center justify-between gap-1">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = newRepeatDays.includes(d.day);
                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => toggleDay(d.day)}
                        title={d.title}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Snooze Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Snooze Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setNewSnoozeMinutes(mins)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        newSnoozeMinutes === mins
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Set Alarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
