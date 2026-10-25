// Comprehensive list of worldwide time zones with metadata
export const WORLD_TIMEZONES = [
  { id: 'local', city: 'Local Time', country: 'Your Location', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', flag: '📍', region: 'Local' },
  { id: 'london', city: 'London', country: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', region: 'Europe' },
  { id: 'newyork', city: 'New York', country: 'United States', timezone: 'America/New_York', flag: '🇺🇸', region: 'Americas' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', region: 'Asia' },
  { id: 'paris', city: 'Paris', country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', region: 'Europe' },
  { id: 'dubai', city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', region: 'Middle East' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', region: 'Asia' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺', region: 'Oceania' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', region: 'Asia' },
  { id: 'sanfrancisco', city: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', flag: '🇺🇸', region: 'Americas' },
  { id: 'berlin', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', region: 'Europe' },
  { id: 'toronto', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', flag: '🇨🇦', region: 'Americas' },
  { id: 'hongkong', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', region: 'Asia' },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', region: 'Oceania' },
  { id: 'saopaulo', city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', region: 'Americas' },
  { id: 'cairo', city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', region: 'Africa' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', region: 'Asia' },
  { id: 'zurich', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', region: 'Europe' },
  { id: 'honolulu', city: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu', flag: '🌺', region: 'Americas' },
  { id: 'johannesburg', city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', region: 'Africa' },
  { id: 'reykjavik', city: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', flag: '🇮🇸', region: 'Europe' },
];

export const DEFAULT_PINNED_CITIES = ['london', 'newyork', 'tokyo', 'mumbai', 'sydney'];

/**
 * Returns current date and time components for a given timezone
 */
export function getTimeInZone(date, timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parts = formatter.formatToParts(date);
    const map = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        map[p.type] = p.value;
      }
    }

    const hours = parseInt(map.hour, 10) || 0;
    const minutes = parseInt(map.minute, 10) || 0;
    const seconds = parseInt(map.second, 10) || 0;
    const milliseconds = date.getMilliseconds();

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
      year: parseInt(map.year, 10),
      month: parseInt(map.month, 10),
      day: parseInt(map.day, 10),
      isDaytime: hours >= 6 && hours < 18,
    };
  } catch (err) {
    // Fallback to local
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      isDaytime: date.getHours() >= 6 && date.getHours() < 18,
    };
  }
}

/**
 * Get formatted offset string (e.g. "+05:30" or "-04:00") and human readable diff from user's local time
 */
export function getTimezoneOffsetDetails(timezone, baseDate = new Date()) {
  try {
    // Format UTC time and target zone time
    const utcDate = new Date(baseDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(baseDate.toLocaleString('en-US', { timeZone: timezone }));
    const localDate = new Date();

    const diffMinutesFromUtc = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
    const diffHoursFromUtc = diffMinutesFromUtc / 60;
    
    const sign = diffMinutesFromUtc >= 0 ? '+' : '-';
    const absMinutes = Math.abs(diffMinutesFromUtc);
    const hrs = String(Math.floor(absMinutes / 60)).padStart(2, '0');
    const mins = String(absMinutes % 60).padStart(2, '0');
    const offsetString = `UTC${sign}${hrs}:${mins}`;

    // Diff from local time
    const diffMinutesFromLocal = Math.round((tzDate.getTime() - localDate.getTime()) / 60000);
    const diffHoursFromLocal = (diffMinutesFromLocal / 60);

    let relativeDiff = 'Same time';
    if (diffHoursFromLocal > 0) {
      relativeDiff = `+${Number(diffHoursFromLocal.toFixed(1))}h ahead`;
    } else if (diffHoursFromLocal < 0) {
      relativeDiff = `${Number(diffHoursFromLocal.toFixed(1))}h behind`;
    }

    return {
      offsetString,
      diffHoursFromUtc,
      diffHoursFromLocal,
      relativeDiff,
    };
  } catch (e) {
    return {
      offsetString: 'UTC+00:00',
      diffHoursFromUtc: 0,
      diffHoursFromLocal: 0,
      relativeDiff: 'Same time',
    };
  }
}
