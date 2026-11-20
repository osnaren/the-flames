import { FLAMES_ORDER, FlamesResultType } from '@/constants/flames';
import { Heart, HeartHandshake, BellRing as Ring, Sword, UserPlus, Users, type LucideIcon } from 'lucide-react';
import type { FlamesResult, ResultStats, TimeFilter } from './types';

export interface ResultMeta {
  key: FlamesResult;
  label: string;
  emoji: string;
  /** Solid colour used by SVG charts and bars. */
  color: string;
  /** Softer companion colour for gradients. */
  soft: string;
  icon: LucideIcon;
  positive: boolean;
}

/** Palette matches the result card so a result looks the same everywhere. */
export const RESULT_META: Record<FlamesResult, ResultMeta> = {
  [FlamesResultType.FRIEND]: {
    key: 'F',
    label: 'Friends',
    emoji: '🤝',
    color: '#3b82f6',
    soft: '#93c5fd',
    icon: Users,
    positive: true,
  },
  [FlamesResultType.LOVE]: {
    key: 'L',
    label: 'Love',
    emoji: '❤️',
    color: '#ec4899',
    soft: '#f9a8d4',
    icon: Heart,
    positive: true,
  },
  [FlamesResultType.AFFECTION]: {
    key: 'A',
    label: 'Affection',
    emoji: '🥰',
    color: '#f59e0b',
    soft: '#fcd34d',
    icon: HeartHandshake,
    positive: true,
  },
  [FlamesResultType.MARRIAGE]: {
    key: 'M',
    label: 'Marriage',
    emoji: '💍',
    color: '#a855f7',
    soft: '#d8b4fe',
    icon: Ring,
    positive: true,
  },
  [FlamesResultType.ENEMY]: {
    key: 'E',
    label: 'Enemies',
    emoji: '😤',
    color: '#ef4444',
    soft: '#fca5a5',
    icon: Sword,
    positive: false,
  },
  [FlamesResultType.SIBLING]: {
    key: 'S',
    label: 'Siblings',
    emoji: '👫',
    color: '#10b981',
    soft: '#6ee7b7',
    icon: UserPlus,
    positive: true,
  },
};

export interface NormalizedResult extends ResultStats {
  share: number;
}

/** Always returns all six results (missing ones as zero) in F-L-A-M-E-S order. */
export function normalizeResults(results: ResultStats[] | undefined): NormalizedResult[] {
  const byKey = new Map((results ?? []).filter((r) => r.result in RESULT_META).map((r) => [r.result, r]));
  const total = [...byKey.values()].reduce((sum, r) => sum + r.count, 0);
  return FLAMES_ORDER.map((key) => {
    const found = byKey.get(key);
    const count = found?.count ?? 0;
    return { result: key, count, trend: found?.trend ?? 0, share: total > 0 ? count / total : 0 };
  });
}

export const PERIOD_LABELS: Record<TimeFilter, { tab: string; noun: string; comparison: string | null }> = {
  today: { tab: 'Today', noun: 'today', comparison: 'vs yesterday' },
  week: { tab: 'This week', noun: 'this week', comparison: 'vs last week' },
  alltime: { tab: 'All time', noun: 'of all time', comparison: null },
};

export const formatPercent = (value: number, digits = 0) => `${(value * 100).toFixed(digits).replace(/\.0+$/, '')}%`;

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en', { notation: value >= 100000 ? 'compact' : 'standard' }).format(value);
