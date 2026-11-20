'use client';

import { Gauge } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPercent, type NormalizedResult } from '../chartTheme';
import ChartCard from './ChartCard';

interface VibeMeterProps {
  results: NormalizedResult[];
  periodNoun: string;
}

const MOODS = [
  { min: 0.85, label: 'Cupid is on fire', emoji: '💘' },
  { min: 0.75, label: 'Love is in the air', emoji: '💖' },
  { min: 0.6, label: 'Mostly warm fuzzies', emoji: '🥰' },
  { min: 0.45, label: 'Mixed signals', emoji: '🤔' },
  { min: 0, label: 'Rivalries are trending', emoji: '😤' },
];

/**
 * "Romance meter": the share of results that are romantic (Love, Affection,
 * Marriage) and how much of the mix is Enemies, shown as a half gauge.
 */
export default function VibeMeter({ results, periodNoun }: VibeMeterProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const total = results.reduce((sum, r) => sum + r.count, 0);
  const share = (keys: string[]) =>
    total > 0 ? results.filter((r) => keys.includes(r.result)).reduce((s, r) => s + r.count, 0) / total : 0;
  const romance = share(['L', 'A', 'M']);
  const friendly = share(['F', 'S']);
  const enemies = share(['E']);
  const warmth = romance + friendly;
  const mood = MOODS.find((m) => warmth >= m.min) ?? MOODS[MOODS.length - 1];

  // Half circle: path length is π·r.
  const r = 80;
  const arc = Math.PI * r;
  const needle = -90 + 180 * (ready ? romance : 0);

  return (
    <ChartCard
      title="Romance meter"
      subtitle={`Love, Affection and Marriage ${periodNoun}`}
      icon={Gauge}
      iconClassName="bg-pink-500/12 text-pink-500"
      delay={0.2}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[240px]">
          <svg viewBox="0 0 200 112" className="w-full" role="img" aria-label={`Romance ${formatPercent(romance)}`}>
            <defs>
              <linearGradient id="vibe-gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              strokeWidth="16"
              strokeLinecap="round"
              className="stroke-surface-container-highest"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#vibe-gradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${ready ? arc * romance : 0} ${arc}`}
              className="transition-[stroke-dasharray] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <g
              className="transition-transform duration-1000 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
              style={{ transform: `rotate(${needle}deg)`, transformOrigin: '100px 100px' }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="34"
                strokeWidth="3"
                strokeLinecap="round"
                className="stroke-on-surface"
              />
            </g>
            <circle cx="100" cy="100" r="6" className="fill-on-surface" />
          </svg>
        </div>
        <span className="text-on-surface -mt-1 text-3xl font-bold tabular-nums">{formatPercent(romance)}</span>

        <p className="text-on-surface mt-1 text-center text-sm font-semibold">
          <span aria-hidden="true">{mood.emoji}</span> {total > 0 ? mood.label : 'Waiting for the first game'}
        </p>

        <dl className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
          {[
            { label: 'Romantic', value: romance, color: 'text-pink-500' },
            { label: 'Friendly', value: friendly, color: 'text-sky-500' },
            { label: 'Enemies', value: enemies, color: 'text-red-500' },
          ].map((item) => (
            <div key={item.label} className="bg-surface-container rounded-xl px-2 py-2">
              <dt className="text-on-surface-variant text-[11px] font-medium">{item.label}</dt>
              <dd className={`text-base font-bold tabular-nums ${item.color}`}>{formatPercent(item.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ChartCard>
  );
}
