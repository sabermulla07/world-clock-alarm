import React, { memo } from 'react';
import { Sun, Moon } from 'lucide-react';

const ROMAN_NUMERALS = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

export const AnalogClock = memo(function AnalogClock({
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
  isSmooth = true,
  faceStyle = 'modern', // 'modern' | 'classic' | 'chronograph' | 'minimal'
  size = 280,
  theme = 'dark',
  showNumbers = true,
  label = '',
}) {
  // Calculate angles
  // 360 degrees / 12 hours = 30 deg/hr. Add minutes and seconds fraction for continuous hour hand movement
  const secondValue = isSmooth ? seconds + milliseconds / 1000 : seconds;
  const minuteValue = minutes + secondValue / 60;
  const hourValue = (hours % 12) + minuteValue / 60;

  const secondAngle = secondValue * 6; // 360 / 60 = 6 deg
  const minuteAngle = minuteValue * 6; // 360 / 60 = 6 deg
  const hourAngle = hourValue * 30; // 360 / 12 = 30 deg

  const center = size / 2;
  const radius = center - 12;

  // Theme-specific colors
  const themeColors = {
    dark: {
      bg: 'url(#darkGrad)',
      bezel: 'stroke-slate-700',
      track: 'stroke-slate-800',
      ticks: 'stroke-slate-400',
      minorTicks: 'stroke-slate-600',
      hourHand: '#f8fafc',
      minuteHand: '#94a3b8',
      secondHand: '#ef4444',
      hub: '#38bdf8',
      text: '#cbd5e1',
    },
    neon: {
      bg: 'url(#neonGrad)',
      bezel: 'stroke-cyan-500/50',
      track: 'stroke-cyan-950',
      ticks: 'stroke-cyan-400',
      minorTicks: 'stroke-cyan-800',
      hourHand: '#38bdf8',
      minuteHand: '#a855f7',
      secondHand: '#ec4899',
      hub: '#ec4899',
      text: '#38bdf8',
    },
    gold: {
      bg: 'url(#goldGrad)',
      bezel: 'stroke-amber-600/40',
      track: 'stroke-amber-950/60',
      ticks: 'stroke-amber-300',
      minorTicks: 'stroke-amber-600/50',
      hourHand: '#fef08a',
      minuteHand: '#fde047',
      secondHand: '#fb923c',
      hub: '#fbbf24',
      text: '#fde047',
    },
    light: {
      bg: 'url(#lightGrad)',
      bezel: 'stroke-slate-300',
      track: 'stroke-slate-100',
      ticks: 'stroke-slate-700',
      minorTicks: 'stroke-slate-400',
      hourHand: '#0f172a',
      minuteHand: '#334155',
      secondHand: '#dc2626',
      hub: '#2563eb',
      text: '#1e293b',
    },
  };

  const colors = themeColors[theme] || themeColors.dark;
  const isDay = hours >= 6 && hours < 18;

  // Render hour marks & numerals
  const hourMarks = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const innerR = radius - (isMajor ? 14 : 9);
    const outerR = radius - 3;
    const x1 = center + innerR * Math.sin(angle);
    const y1 = center - innerR * Math.cos(angle);
    const x2 = center + outerR * Math.sin(angle);
    const y2 = center - outerR * Math.cos(angle);

    // Number position
    const textR = radius - 24;
    const tx = center + textR * Math.sin(angle);
    const ty = center - textR * Math.cos(angle);

    let displayNum = i === 0 ? 12 : i;
    if (faceStyle === 'classic') {
      displayNum = ROMAN_NUMERALS[i];
    }

    hourMarks.push(
      <g key={i}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={isMajor ? 2.5 : 1.5}
          className={isMajor ? colors.ticks : colors.minorTicks}
          strokeLinecap="round"
        />
        {showNumbers && faceStyle !== 'minimal' && (
          <text
            x={tx}
            y={ty + 4}
            textAnchor="middle"
            fill={colors.text}
            fontSize={size > 200 ? (faceStyle === 'classic' ? 12 : 13) : 9}
            fontWeight={isMajor ? '700' : '500'}
            className="select-none font-mono-numbers"
          >
            {displayNum}
          </text>
        )}
      </g>
    );
  }

  // Minor minute ticks (60 total)
  const minuteTicks = [];
  if (size >= 180 && faceStyle !== 'minimal') {
    for (let m = 0; m < 60; m++) {
      if (m % 5 === 0) continue; // Skip hour marks
      const angle = (m * 6 * Math.PI) / 180;
      const innerR = radius - 6;
      const outerR = radius - 3;
      minuteTicks.push(
        <line
          key={`m-${m}`}
          x1={center + innerR * Math.sin(angle)}
          y1={center - innerR * Math.cos(angle)}
          x2={center + outerR * Math.sin(angle)}
          y2={center - outerR * Math.cos(angle)}
          strokeWidth={1}
          className={colors.minorTicks}
          opacity={0.6}
        />
      );
    }
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none group">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transition-transform duration-300 transform group-hover:scale-[1.02]"
        style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.4))' }}
      >
        <defs>
          {/* Radial backgrounds for each theme */}
          <radialGradient id="darkGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="75%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id="neonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="80%" stopColor="#020617" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>
          <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#291e0a" />
            <stop offset="70%" stopColor="#171104" />
            <stop offset="100%" stopColor="#0a0701" />
          </radialGradient>
          <radialGradient id="lightGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>

          {/* Hand Glow Filter */}
          <filter id="handGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Ring & Bezel */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={colors.bg}
          strokeWidth="3.5"
          className={`${colors.bezel} transition-colors`}
        />

        {/* Inner subtle concentric track */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.72}
          fill="none"
          strokeWidth="1"
          className={colors.track}
          strokeDasharray="3 3"
          opacity={0.4}
        />

        {/* Chronograph Sub-Dial Simulation (if selected and large size) */}
        {faceStyle === 'chronograph' && size >= 220 && (
          <g opacity={0.65}>
            {/* Top 24-hr subdial */}
            <circle cx={center} cy={center - radius * 0.36} r={radius * 0.22} fill="none" strokeWidth="1" stroke={colors.text} opacity={0.3} />
            <text x={center} y={center - radius * 0.36 + 3} textAnchor="middle" fontSize="8" fill={colors.text} fontWeight="600">
              {hours}H
            </text>

            {/* Bottom seconds subdial */}
            <circle cx={center} cy={center + radius * 0.36} r={radius * 0.22} fill="none" strokeWidth="1" stroke={colors.text} opacity={0.3} />
            <text x={center} y={center + radius * 0.36 + 3} textAnchor="middle" fontSize="8" fill={colors.text} fontWeight="600">
              SEC
            </text>
          </g>
        )}

        {/* Ticks and Numerals */}
        {minuteTicks}
        {hourMarks}

        {/* Day/Night subtle Icon inside dial */}
        {size >= 200 && (
          <g transform={`translate(${center - 8}, ${center + radius * 0.55})`} opacity={0.5}>
            {isDay ? (
              <Sun size={16} className="text-amber-400 stroke-amber-400" />
            ) : (
              <Moon size={16} className="text-indigo-400 stroke-indigo-400" />
            )}
          </g>
        )}

        {/* Brand / Label */}
        {label && size >= 180 && (
          <text
            x={center}
            y={center - radius * 0.42}
            textAnchor="middle"
            fill={colors.text}
            fontSize="9"
            fontWeight="700"
            letterSpacing="2px"
            opacity={0.7}
            className="uppercase font-sans"
          >
            {label}
          </text>
        )}

        {/* ================= CLOCK HANDS ================= */}

        {/* HOUR HAND */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.52}
          stroke={colors.hourHand}
          strokeWidth={size > 200 ? 5 : 3.5}
          strokeLinecap="round"
          transform={`rotate(${hourAngle} ${center} ${center})`}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        />

        {/* MINUTE HAND */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.76}
          stroke={colors.minuteHand}
          strokeWidth={size > 200 ? 3.5 : 2.5}
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} ${center} ${center})`}
          style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.5))' }}
        />

        {/* SECOND HAND with counterweight and smooth sweep */}
        <g transform={`rotate(${secondAngle} ${center} ${center})`}>
          {/* Main needle */}
          <line
            x1={center}
            y1={center + radius * 0.18} // Counterweight extending backward
            x2={center}
            y2={center - radius * 0.88} // Tip
            stroke={colors.secondHand}
            strokeWidth={size > 200 ? 1.8 : 1.2}
            strokeLinecap="round"
            filter={theme === 'neon' ? 'url(#handGlow)' : undefined}
          />
          {/* Small ring counterweight */}
          <circle
            cx={center}
            cy={center + radius * 0.12}
            r={size > 200 ? 3.5 : 2}
            fill="none"
            stroke={colors.secondHand}
            strokeWidth="1.5"
          />
        </g>

        {/* Center Hub / Pivot Cap */}
        <circle cx={center} cy={center} r={size > 200 ? 5.5 : 3.5} fill={colors.hub} />
        <circle cx={center} cy={center} r={size > 200 ? 2 : 1.2} fill="#ffffff" />
      </svg>
    </div>
  );
});
