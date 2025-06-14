import { DivideIcon as LucideIcon } from 'lucide-react';

export type TimeFilter = 'today' | 'week' | 'alltime';
export type FlamesResult = 'F' | 'L' | 'A' | 'M' | 'E' | 'S';

export interface NameStats {
  name: string;
  count: number;
  trend: number; // percentage change
}

export interface ResultStats {
  result: FlamesResult;
  count: number;
  trend: number; // percentage change
}

export interface PairStats {
  name1: string;
  name2: string;
  result: FlamesResult;
  count: number;
}

export interface RegionalStats {
  country: string;
  names: NameStats[];
  results: ResultStats[];
  pairs: PairStats[];
}

export interface GlobalStats {
  totalMatches: number;
  todayMatches: number;
  popularNames: NameStats[];
  resultStats: ResultStats[];
  popularPairs: PairStats[];
  regionalStats: RegionalStats | null;
}

export interface ResultInfo {
  text: string;
  icon: typeof LucideIcon;
  color: string;
  bgColor: string;
}
