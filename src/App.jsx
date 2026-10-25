import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroClockSection } from './components/HeroClockSection';
import { WorldClockSection } from './components/WorldClockSection';
import { TimeConverter } from './components/TimeConverter';
import { AlarmSection } from './components/AlarmSection';
import { AlarmModal } from './components/AlarmModal';
import { StopwatchTimerSection } from './components/StopwatchTimerSection';
import { SettingsModal } from './components/SettingsModal';
import { useRealTime } from './hooks/useRealTime';
import { useAlarms } from './hooks/useAlarms';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WORLD_TIMEZONES } from './constants/timezones';
import { soundSynth } from './utils/soundEffects';

export function App() {
  // ================= DYNAMIC UI SETTINGS (PERSISTENT) =================
  const [theme, setTheme] = useLocalStorage('chronos_theme', 'dark');
  const [faceStyle, setFaceStyle] = useLocalStorage('chronos_face_style', 'modern');
  const [isSmoothSweep, setIsSmoothSweep] = useLocalStorage('chronos_smooth_sweep', true);
  const [is24Hour, setIs24Hour] = useLocalStorage('chronos_24h', false);
  const [showSeconds, setShowSeconds] = useLocalStorage('chronos_seconds', true);
  const [showMilliseconds, setShowMilliseconds] = useLocalStorage('chronos_ms', false);
  const [tickSoundEnabled, setTickSoundEnabled] = useLocalStorage('chronos_tick_sound', false);

  // Pinned world cities
  const [pinnedCityIds, setPinnedCityIds] = useLocalStorage('chronos_pinned_cities', [
    'local',
    'london',
    'newyork',
    'tokyo',
    'mumbai',
    'sydney',
  ]);

  // Primary featured city
  const [primaryCityId, setPrimaryCityId] = useLocalStorage('chronos_primary_city', 'local');

  // UI Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active navigation tab for mobile/quick switching
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'clocks' | 'world' | 'converter' | 'alarms' | 'tools'

  // Master Clock Hook
  const { currentTime, smoothTime } = useRealTime(isSmoothSweep);

  // Alarms Hook
  const {
    alarms,
    ringingAlarm,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    dismissAlarm,
    snoozeAlarm,
  } = useAlarms(currentTime);

  // Tick sound effect on discrete seconds change
  const lastSecondRef = useRef(currentTime.getSeconds());
  useEffect(() => {
    if (tickSoundEnabled && currentTime.getSeconds() !== lastSecondRef.current) {
      lastSecondRef.current = currentTime.getSeconds();
      soundSynth.playTick(0.08);
    }
  }, [currentTime, tickSoundEnabled]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-neon', 'theme-gold', 'theme-light');
    root.classList.add(`theme-${theme}`);
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  // Add a city to pinned list
  const handleAddCity = (cityId) => {
    if (!pinnedCityIds.includes(cityId)) {
      setPinnedCityIds([...pinnedCityIds, cityId]);
    }
  };

  // Remove a city
  const handleRemoveCity = (cityId) => {
    setPinnedCityIds(pinnedCityIds.filter((id) => id !== cityId));
    if (primaryCityId === cityId) {
      setPrimaryCityId('local');
    }
  };

  // Set primary hero city
  const handleSetPrimaryCity = (cityId) => {
    setPrimaryCityId(cityId);
  };

  // Reset defaults
  const handleResetDefaults = () => {
    setTheme('dark');
    setFaceStyle('modern');
    setIsSmoothSweep(true);
    setIs24Hour(false);
    setShowSeconds(true);
    setShowMilliseconds(false);
    setTickSoundEnabled(false);
    setPinnedCityIds(['local', 'london', 'newyork', 'tokyo', 'mumbai', 'sydney']);
    setPrimaryCityId('local');
  };

  // Primary city data object
  const primaryCity =
    WORLD_TIMEZONES.find((c) => c.id === primaryCityId) ||
    WORLD_TIMEZONES[0];

  const activeAlarmCount = alarms.filter((a) => a.enabled).length;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'light'
        ? 'bg-slate-50 text-slate-900'
        : theme === 'neon'
        ? 'bg-slate-950 text-cyan-50'
        : theme === 'gold'
        ? 'bg-[#0c0a06] text-amber-50'
        : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Application Header */}
      <Header
        activeAlarmCount={activeAlarmCount}
        pinnedCount={pinnedCityIds.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Navigation Tabs Bar for easy view switching */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'all', label: 'All-in-One Dashboard' },
              { id: 'clocks', label: 'Master Clock' },
              { id: 'world', label: 'World Network' },
              { id: 'converter', label: 'Time Converter' },
              { id: 'alarms', label: `Alarms (${activeAlarmCount})` },
              { id: 'tools', label: 'Stopwatch & Timer' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-500 font-mono-numbers">
            UTC {currentTime.toUTCString().slice(17, 25)}
          </div>
        </div>

        {/* 1. HERO DUAL CLOCK SECTION (Analog + Digital) */}
        {(activeTab === 'all' || activeTab === 'clocks') && (
          <HeroClockSection
            currentTime={currentTime}
            smoothTime={smoothTime}
            primaryCity={primaryCity}
            faceStyle={faceStyle}
            setFaceStyle={setFaceStyle}
            isSmoothSweep={isSmoothSweep}
            setIsSmoothSweep={setIsSmoothSweep}
            is24Hour={is24Hour}
            setIs24Hour={setIs24Hour}
            showSeconds={showSeconds}
            setShowSeconds={setShowSeconds}
            showMilliseconds={showMilliseconds}
            setShowMilliseconds={setShowMilliseconds}
            tickSoundEnabled={tickSoundEnabled}
            setTickSoundEnabled={setTickSoundEnabled}
            theme={theme}
          />
        )}

        {/* 2. WORLD CLOCK NETWORK SECTION */}
        {(activeTab === 'all' || activeTab === 'world') && (
          <WorldClockSection
            pinnedCityIds={pinnedCityIds}
            currentTime={currentTime}
            is24Hour={is24Hour}
            isSmoothSweep={isSmoothSweep}
            faceStyle={faceStyle}
            theme={theme}
            primaryCityId={primaryCityId}
            onAddCity={handleAddCity}
            onRemoveCity={handleRemoveCity}
            onSetPrimaryCity={handleSetPrimaryCity}
          />
        )}

        {/* 3. TIME CONVERTER & MEETING PLANNER */}
        {(activeTab === 'all' || activeTab === 'converter') && (
          <TimeConverter
            pinnedCityIds={pinnedCityIds}
            currentTime={currentTime}
            is24Hour={is24Hour}
          />
        )}

        {/* 4. ALARMS & REMINDERS SECTION */}
        {(activeTab === 'all' || activeTab === 'alarms') && (
          <AlarmSection
            alarms={alarms}
            currentTime={currentTime}
            is24Hour={is24Hour}
            onAddAlarm={addAlarm}
            onToggleAlarm={toggleAlarm}
            onDeleteAlarm={deleteAlarm}
          />
        )}

        {/* 5. PRECISION STOPWATCH & COUNTDOWN TIMER */}
        {(activeTab === 'all' || activeTab === 'tools') && (
          <StopwatchTimerSection />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Chronos World-Clock Dashboard • React & Vite Powered</p>
          <div className="flex items-center gap-4">
            <span>High-Precision Real-Time Engine</span>
            <span>•</span>
            <span>Web Audio API Synthesizer</span>
            <span>•</span>
            <span>GPU-Accelerated SVG</span>
          </div>
        </div>
      </footer>

      {/* ACTIVE RINGING ALARM OVERLAY MODAL */}
      <AlarmModal
        alarm={ringingAlarm}
        onDismiss={dismissAlarm}
        onSnooze={snoozeAlarm}
      />

      {/* DASHBOARD SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        faceStyle={faceStyle}
        setFaceStyle={setFaceStyle}
        isSmoothSweep={isSmoothSweep}
        setIsSmoothSweep={setIsSmoothSweep}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        showSeconds={showSeconds}
        setShowSeconds={setShowSeconds}
        showMilliseconds={showMilliseconds}
        setShowMilliseconds={setShowMilliseconds}
        tickSoundEnabled={tickSoundEnabled}
        setTickSoundEnabled={setTickSoundEnabled}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}

export default App;
