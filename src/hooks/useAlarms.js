import { useState, useEffect, useRef, useCallback } from 'react';
import { soundSynth } from '../utils/soundEffects';

const STORAGE_KEY = 'chronos_alarms_v1';

const DEFAULT_ALARMS = [
  {
    id: 'alarm-1',
    label: 'Morning Standup & Markets',
    time: '09:00',
    enabled: true,
    repeatDays: [1, 2, 3, 4, 5], // Mon-Fri
    sound: 'marimba',
    snoozeMinutes: 5,
    lastTriggered: null,
  },
  {
    id: 'alarm-2',
    label: 'Global Team Sync',
    time: '14:30',
    enabled: false,
    repeatDays: [1, 2, 3, 4], // Mon-Thu
    sound: 'electronic',
    snoozeMinutes: 10,
    lastTriggered: null,
  }
];

export function useAlarms(currentTime) {
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ALARMS;
    } catch {
      return DEFAULT_ALARMS;
    }
  });

  const [ringingAlarm, setRingingAlarm] = useState(null);
  const audioIntervalRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch (e) {
      console.warn('Failed to save alarms to localStorage', e);
    }
  }, [alarms]);

  // Request browser notification permissions on first interaction
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (e) {
        // Notification permission denied or ignored
      }
    }
  }, []);

  // Check alarms every second against currentTime
  useEffect(() => {
    if (!currentTime) return;

    const currentHours = String(currentTime.getHours()).padStart(2, '0');
    const currentMins = String(currentTime.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;
    const currentDay = currentTime.getDay(); // 0 is Sunday, 1 is Monday...
    const currentSeconds = currentTime.getSeconds();

    // Only trigger in the first 2 seconds of the minute
    if (currentSeconds > 2) return;

    alarms.forEach((alarm) => {
      if (!alarm.enabled) return;

      const repeatsToday = !alarm.repeatDays || alarm.repeatDays.length === 0 || alarm.repeatDays.includes(currentDay);
      const isTimeMatch = alarm.time === currentTimeStr;

      // Prevent re-triggering repeatedly within the same minute
      const todayDateStr = currentTime.toDateString();
      const alreadyTriggeredThisMinute = alarm.lastTriggered === `${todayDateStr} ${currentTimeStr}`;

      if (isTimeMatch && repeatsToday && !alreadyTriggeredThisMinute) {
        triggerAlarm(alarm, `${todayDateStr} ${currentTimeStr}`);
      }
    });
  }, [currentTime, alarms]);

  // Trigger an alarm
  const triggerAlarm = useCallback((alarm, triggerStamp) => {
    setRingingAlarm(alarm);

    // Play immediate sound
    soundSynth.playAlarm(alarm.sound || 'electronic', 0.8);

    // Loop audio chime every 3 seconds while ringing
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = setInterval(() => {
      soundSynth.playAlarm(alarm.sound || 'electronic', 0.8);
    }, 3200);

    // Web Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ Alarm: ${alarm.label || 'Time Up!'}`, {
          body: `It's ${alarm.time}. Time for: ${alarm.label}`,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Ignore notification errors
      }
    }

    // Update lastTriggered stamp
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarm.id ? { ...a, lastTriggered: triggerStamp } : a))
    );
  }, []);

  // Stop audio loop
  const stopAlarmSound = useCallback(() => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
  }, []);

  // Dismiss ringing alarm
  const dismissAlarm = useCallback(() => {
    stopAlarmSound();
    setRingingAlarm(null);
  }, [stopAlarmSound]);

  // Snooze ringing alarm
  const snoozeAlarm = useCallback((minutes = 5) => {
    stopAlarmSound();
    if (!ringingAlarm) return;

    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozedHours = String(now.getHours()).padStart(2, '0');
    const snoozedMins = String(now.getMinutes()).padStart(2, '0');
    const snoozedTimeStr = `${snoozedHours}:${snoozedMins}`;

    // Add a temporary snoozed alarm or update current alarm
    const snoozedAlarm = {
      ...ringingAlarm,
      id: `snooze-${Date.now()}`,
      label: `${ringingAlarm.label} (Snoozed +${minutes}m)`,
      time: snoozedTimeStr,
      enabled: true,
      repeatDays: [], // triggers once
    };

    setAlarms((prev) => [snoozedAlarm, ...prev]);
    setRingingAlarm(null);
  }, [ringingAlarm, stopAlarmSound]);

  // Add new alarm
  const addAlarm = useCallback((alarmData) => {
    const newAlarm = {
      id: `alarm-${Date.now()}`,
      label: alarmData.label || 'Alarm',
      time: alarmData.time,
      enabled: true,
      repeatDays: alarmData.repeatDays || [],
      sound: alarmData.sound || 'electronic',
      snoozeMinutes: alarmData.snoozeMinutes || 5,
      lastTriggered: null,
    };
    setAlarms((prev) => [newAlarm, ...prev]);
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // Toggle alarm enable/disable
  const toggleAlarm = useCallback((id) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  // Delete alarm
  const deleteAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    alarms,
    ringingAlarm,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    dismissAlarm,
    snoozeAlarm,
    requestNotificationPermission,
  };
}
