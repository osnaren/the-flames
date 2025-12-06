import { FlamesResult } from '@shared/constants/flames';
import { LucideIcon } from 'lucide-react';

export type TimeFilter = 'today' | 'week' | 'alltime';
export type { FlamesResult };

export interface ResultStats {
  result: FlamesResult;
  count: number;
  trend: number; // percentage change
}

export interface RecentMatch {
  result: FlamesResult;
  country: string | null;
  created_at: string;
}

export interface TopCountry {
  country: string;
  count: number;
}

export interface RegionalStats {
  country: string;
  results: ResultStats[];
}

export interface GlobalStats {
  totalMatches: number;
  todayMatches: number;
  resultStats: ResultStats[];
  recentMatches: RecentMatch[];
  topCountries: TopCountry[];
  regionalStats: RegionalStats | null;
}

export interface ResultInfo {
  text: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  barColor: string;
}
