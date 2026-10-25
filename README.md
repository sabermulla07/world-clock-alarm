# CHRONOS - Advanced Real-Time Clock & World Dashboard

A high-performance real-time clock and global time management dashboard built with **React**, **Vite**, and **Tailwind CSS**. Combines precision analog clockwork, digital readout, multi-region world clock tracking, interactive time converter/meeting planner, audio-synthesized alarms, and dynamic UI customization.

---

## 🌟 Key Features

### 1. ⏱️ Precision Analog Clock
- **Vector SVG Rendering**: Hardware-accelerated, crisp scaling at any resolution with custom drop shadows and bevel rings.
- **60 FPS Continuous Sweep or Discrete Tick**: Choose between a silky-smooth mechanical sweep hand (via `requestAnimationFrame`) or a discrete quartz tick.
- **4 Distinct Clock Face Styles**:
  - `Modern Dial`: Sleek indices and concentric track.
  - `Classic Roman`: Traditional Roman numerals (I - XII) with railway minute track.
  - `Chronograph`: Sport multi-dial aesthetic with 24-hour and seconds sub-dials.
  - `Bauhaus Minimal`: Ultra-clean Scandinavian design.
- **Subtle Day/Night Solar Dial**: Integrated sun/moon indicator showing daylight status.

### 2. 🔢 High-Tech Digital Clock
- **Flexible Format**: Instant toggle between **12-Hour (AM/PM)** and **24-Hour (Military)** formats.
- **Seconds & Milliseconds Counter**: Optional high-precision hundredths-of-a-second readout.
- **Full Calendar Readout**: Displays weekday, localized full date, **Day of the Year** (e.g. Day 298), and **Week of the Year** (e.g. Wk 43).
- **Timezone Offset Badge**: Shows current UTC offset (e.g., `UTC+05:30`) and daylight status.

### 3. 🌍 Global World Clock Network
- **Multi-Region Live Tracking**: Monitor live time across 20+ global tech and financial centers (London, New York, Tokyo, Dubai, Singapore, Sydney, Mumbai, Paris, etc.).
- **Synchronized Mini Analog & Digital Clocks**: Each card renders an independent real-time analog face and digital time.
- **Relative Offset & Business Hour Badges**:
  - Live delta indicator (e.g. `+5.5h ahead`, `9h behind`).
  - Active **Business Hours** tag (`09:00 - 17:00`), **Evening Hours**, or **Night / Closed**.
- **Add / Remove / Pin**: Searchable modal by city, country, or continent filter; star any city to promote it as the primary hero clock.

### 4. 🎛️ Interactive Time Converter & Meeting Planner
- **Interactive 24-Hour Scrubber**: Drag slider from `-12h` to `+12h` in 15-minute increments.
- **Instant World Matrix**: Immediately previews converted times across all pinned world cities simultaneously to coordinate international calls and market openings.
- **One-Click Reset**: Instant snap back to live system time.

### 5. ⏰ Smart Alarms & Audio Synthesizer
- **Web Audio API Sound Engine**: Zero external audio files required. Uses pure trigonometric waveforms (sine, triangle, square, sawtooth) for instant, low-latency, offline audio playback.
  - *Electronic Beep*, *Marimba Melodic*, *Cosmic Synth*, *Resonant Bell*, and *Classic Digital*.
  - Includes a **Sound Preview** button.
- **Repeat & Frequency Options**: Daily, Weekdays (Mon-Fri), Weekends, or custom day selection.
- **Snooze Engine**: Postpone alarms by 5, 10, or 15 minutes.
- **Active Alarm Pop-up Modal**: Fullscreen/overlay alert with audio loop, confetti burst, pulsing radar glow, snooze, and dismiss controls.
- **Web Notification API**: Requests desktop push notifications so alarms trigger even if minimized.

### 6. ⏱️ Precision Stopwatch & Countdown Timer
- **Stopwatch**: Millisecond-accurate stopwatch with lap splits, highlighting fastest lap in green and slowest in red.
- **Countdown Timer**: 1m, 5m, 15m, 25m Pomodoro, and 60m presets with animated circular progress bar and chime upon completion.

### 7. 🎨 Dynamic UI Controls & Themes
- **4 Color Themes**:
  - *Obsidian Slate* (Deep dark mode)
  - *Cyberpunk Neon* (Vibrant cyan and magenta glow)
  - *Imperial Gold* (Luxury black & warm gold)
  - *Clean Frost* (Crisp light mode)
- **Mechanical Tick Sound**: Toggle subtle acoustic tick audio sound on every second.
- **Fullscreen Mode**: Browser Fullscreen API integration for clean wall-mounted or kiosk displays.
- **Local Storage Persistence**: Preserves your alarms, pinned timezones, favorite themes, and display settings across page reloads.

---

## 🛠️ Tech Stack & Architecture

- **React 18**: Modular components, custom hooks (`useRealTime`, `useAlarms`, `useLocalStorage`).
- **Vite 6**: Instant HMR, lightning-fast compilation, and small bundle size.
- **Tailwind CSS 3**: Custom glassmorphism, responsive grids, and dark theme support.
- **Lucide React**: Clean, modern UI icon set.
- **Canvas Confetti**: Visual celebration for alarm completion.
- **Web Audio API**: Synthesizes tones dynamically in code.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "c:\Users\Saber Mulla\OneDrive\Documents\WT ASSIGNMENT\LAB 02"
   ```

2. Dependencies are already installed. To install again:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```
