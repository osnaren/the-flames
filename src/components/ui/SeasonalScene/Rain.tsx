import type { CSSProperties } from 'react';

/**
 * Monsoon rain: three parallax sheets of randomly placed streaks.
 *
 * Each sheet is a single element whose mask is a tile of streaks; it slides down
 * by exactly one tile height per loop, so the motion is seamless and costs one
 * compositor layer per sheet instead of one per drop. The sheets are tilted
 * together, so drops fall along their own slant. The colour comes from the
 * element's background, which lets light and dark themes tint the rain.
 */

/** Small deterministic PRNG so the server and client render identical tiles. */
function random(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function streakTile(seed: number, width: number, height: number, count: number, length: [number, number]) {
  const next = random(seed);
  const streaks: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(next() * width * 10) / 10;
    const y = Math.round(next() * height);
    const len = Math.round(length[0] + next() * (length[1] - length[0]));
    const opacity = (0.45 + next() * 0.55).toFixed(2);
    // Draw the streak twice when it crosses the tile edge, so the tile wraps cleanly.
    for (const offset of y + len > height ? [0, -height] : [0]) {
      // A thin rounded rect (not a line): gradients need a non-zero-width box to render.
      streaks.push(
        `<rect x='${x}' y='${y + offset}' width='1.5' height='${len}' rx='0.75' fill='url(%23g)' fill-opacity='${opacity}'/>`
      );
    }
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='white' stop-opacity='0'/>` +
    `<stop offset='1' stop-color='white'/></linearGradient></defs>` +
    `${streaks.join('')}</svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
}

const SHEETS = [
  // Far: small, faint, slow.
  { tile: [180, 260], count: 22, length: [10, 18], duration: '1.35s', opacity: 0.45, seed: 11, className: '' },
  // Middle.
  { tile: [240, 340], count: 16, length: [18, 30], duration: '0.95s', opacity: 0.6, seed: 23, className: '' },
  // Near: long, bright, fast. Skipped on small screens to keep the view calm.
  {
    tile: [320, 460],
    count: 9,
    length: [34, 52],
    duration: '0.7s',
    opacity: 0.7,
    seed: 37,
    className: 'hidden sm:block',
  },
] as const;

export function RainSheets() {
  return (
    <div className="scene-piece inset-0 overflow-hidden" aria-hidden="true">
      {/* Oversized and tilted so the slanted sheets still cover every corner. */}
      <div className="absolute -inset-[15%] rotate-[10deg]">
        {SHEETS.map((sheet) => {
          const [width, height] = sheet.tile;
          const mask = streakTile(sheet.seed, width, height, sheet.count, sheet.length as unknown as [number, number]);
          return (
            <div
              key={sheet.seed}
              className={`scene-rainfall absolute inset-x-0 bg-sky-700 dark:bg-sky-200 ${sheet.className}`}
              style={
                {
                  top: `-${height}px`,
                  bottom: 0,
                  opacity: sheet.opacity,
                  maskImage: mask,
                  WebkitMaskImage: mask,
                  maskSize: `${width}px ${height}px`,
                  WebkitMaskSize: `${width}px ${height}px`,
                  '--tile': `${height}px`,
                  '--dur': sheet.duration,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}

/** Ripples where drops land on the water line at the bottom of the screen. */
const RIPPLES = [
  ['6%', '1.9s', '0s'],
  ['18%', '2.3s', '-0.7s'],
  ['31%', '2.1s', '-1.4s'],
  ['47%', '2.6s', '-0.3s'],
  ['58%', '2s', '-1.1s'],
  ['71%', '2.4s', '-1.8s'],
  ['84%', '2.2s', '-0.5s'],
  ['93%', '2.5s', '-1.6s'],
] as const;

export function RainRipples() {
  return (
    <>
      {RIPPLES.map(([left, dur, delay], index) => (
        <div
          key={left}
          aria-hidden="true"
          className={`scene-piece scene-ripple bottom-[1.2vh] h-2.5 w-10 rounded-[50%] border border-sky-700/50 dark:border-sky-100/50 ${
            index % 2 ? 'hidden sm:block' : ''
          }`}
          style={{ left, '--dur': dur, '--delay': delay } as CSSProperties}
        />
      ))}
    </>
  );
}
