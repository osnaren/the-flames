import { DivideIcon as LucideIcon } from 'lucide-react';
import { FlamesResult } from '@/constants/flames';

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
  icon: typeof LucideIcon;
  color: string;
  bgColor: string;
}
