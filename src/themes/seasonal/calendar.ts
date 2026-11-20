import type { SeasonalTheme } from './types';

/**
 * Festival calendar used to pick the automatic seasonal theme.
 *
 * Lunar and lunisolar festivals move every year, so fixed month/day windows
 * were wrong most years (and Halloween used to shadow Diwali). Movable dates
 * below are the main festival day for each year; the theme runs for a window
 * around it. Years outside the table fall back to the static windows.
 */

type YMD = [month: number, day: number];

const MOVABLE: Partial<Record<SeasonalTheme, { dates: Record<number, YMD>; before: number; after: number }>> = {
  // Lakshmi Puja
  diwali: {
    dates: { 2025: [10, 20], 2026: [11, 8], 2027: [10, 29], 2028: [10, 17], 2029: [11, 5], 2030: [10, 26] },
    before: 10,
    after: 4,
  },
  // Rangwali Holi (colour day)
  holi: {
    dates: { 2025: [3, 14], 2026: [3, 4], 2027: [3, 22], 2028: [3, 11], 2029: [3, 1], 2030: [3, 20], 2031: [3, 9] },
    before: 8,
    after: 3,
  },
  // Spring Festival (Lunar New Year's Day)
  lunarNewYear: {
    dates: { 2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13], 2030: [2, 3] },
    before: 6,
    after: 10,
  },
  // Eid al-Fitr
  eid: {
    dates: { 2025: [3, 31], 2026: [3, 20], 2027: [3, 10], 2028: [2, 27], 2029: [2, 14], 2030: [2, 5] },
    before: 3,
    after: 4,
  },
  // Raksha Bandhan
  rakhi: {
    dates: { 2025: [8, 9], 2026: [8, 28], 2027: [8, 17], 2028: [8, 5], 2029: [8, 23], 2030: [8, 13], 2031: [8, 2] },
    before: 5,
    after: 1,
  },
  // Thiruvonam
  onam: {
    dates: { 2025: [9, 5], 2026: [8, 26], 2027: [9, 12], 2028: [9, 1], 2029: [8, 22], 2030: [9, 9], 2031: [8, 30] },
    before: 9,
    after: 2,
  },
};

/** Second festival window that shares a theme (Eid al-Adha uses the Eid theme). */
const SECONDARY: Partial<Record<SeasonalTheme, { dates: Record<number, YMD>; before: number; after: number }>> = {
  eid: {
    dates: { 2025: [6, 6], 2026: [5, 27], 2027: [5, 16], 2028: [5, 5], 2029: [4, 24], 2030: [4, 13] },
    before: 2,
    after: 3,
  },
};

/** Fixed-date festivals: main day plus a window around it. */
const FIXED: { theme: SeasonalTheme; day: YMD; before: number; after: number }[] = [
  { theme: 'newYear', day: [1, 1], before: 5, after: 4 },
  { theme: 'pongal', day: [1, 14], before: 3, after: 3 },
  { theme: 'valentine', day: [2, 14], before: 7, after: 1 },
  { theme: 'halloween', day: [10, 31], before: 7, after: 1 },
  { theme: 'christmas', day: [12, 25], before: 24, after: 1 },
];

/** Gentle seasonal moods used only when no festival is running. */
const SEASONS: { theme: SeasonalTheme; range: [number, number, number, number] }[] = [
  { theme: 'spring', range: [3, 25, 4, 25] },
  { theme: 'monsoon', range: [7, 1, 7, 28] },
  { theme: 'autumn', range: [10, 3, 10, 22] },
];

/** Static fallbacks for years missing from the movable table. */
const FALLBACK: { theme: SeasonalTheme; range: [number, number, number, number] }[] = [
  { theme: 'lunarNewYear', range: [1, 28, 2, 12] },
  { theme: 'holi', range: [3, 5, 3, 18] },
  { theme: 'eid', range: [3, 25, 4, 2] },
  { theme: 'rakhi', range: [8, 8, 8, 18] },
  { theme: 'onam', range: [8, 25, 9, 10] },
  { theme: 'diwali', range: [10, 22, 11, 10] },
];

const DAY = 24 * 60 * 60 * 1000;

function dayIndex(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY);
}

function inRange(date: Date, [sm, sd, em, ed]: [number, number, number, number]) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const value = m * 100 + d;
  const start = sm * 100 + sd;
  const end = em * 100 + ed;
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

function firstSundayOfAugust(year: number): YMD {
  const first = new Date(year, 7, 1);
  return [8, 1 + ((7 - first.getDay()) % 7)];
}

/** Signed distance in days from `date` to the festival day nearest it, if within its window. */
function windowDistance(date: Date, [month, day]: YMD, year: number, before: number, after: number) {
  const target = Math.floor(Date.UTC(year, month - 1, day) / DAY);
  const diff = dayIndex(date) - target;
  return diff >= -before && diff <= after ? Math.abs(diff) : null;
}

/**
 * Returns the festival or season to show for a date, or 'default'.
 * When festival windows overlap, the one whose main day is closest wins
 * (e.g. Valentine's Day inside a Lunar New Year week).
 */
export function detectSeasonalTheme(date: Date = new Date()): SeasonalTheme {
  const year = date.getFullYear();
  let best: { theme: SeasonalTheme; distance: number } | null = null;
  const consider = (theme: SeasonalTheme, distance: number | null) => {
    if (distance !== null && (!best || distance < best.distance)) best = { theme, distance };
  };

  // Movable festivals (neighbouring years cover windows that cross Jan 1).
  for (const [theme, rule] of Object.entries(MOVABLE) as [
    SeasonalTheme,
    NonNullable<(typeof MOVABLE)[SeasonalTheme]>,
  ][]) {
    for (const y of [year - 1, year, year + 1]) {
      const ymd = rule.dates[y];
      if (ymd) consider(theme, windowDistance(date, ymd, y, rule.before, rule.after));
    }
    const secondary = SECONDARY[theme];
    const ymd2 = secondary?.dates[year];
    if (secondary && ymd2) consider(theme, windowDistance(date, ymd2, year, secondary.before, secondary.after));
  }

  // Fixed festivals.
  for (const { theme, day, before, after } of FIXED) {
    for (const y of [year - 1, year, year + 1]) consider(theme, windowDistance(date, day, y, before, after));
  }

  // Friendship Day (first Sunday of August).
  consider('friendship', windowDistance(date, firstSundayOfAugust(year), year, 4, 1));

  if (best) return (best as { theme: SeasonalTheme }).theme;

  // Static fallbacks for festivals when the year is outside the table.
  for (const { theme, range } of FALLBACK) {
    if (!MOVABLE[theme]?.dates[year] && inRange(date, range)) return theme;
  }

  // Seasons.
  for (const { theme, range } of SEASONS) if (inRange(date, range)) return theme;

  return 'default';
}
