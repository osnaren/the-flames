/**
 * FLAMES Result Data
 * Shared utilities for result rendering across modules
 */
import { FlamesResultType } from '@/constants/flames';
import type { LucideIcon } from 'lucide-react';
import { BellRing, Heart, Star, Sword, Users } from 'lucide-react';

export type FlamesResult = 'F' | 'L' | 'A' | 'M' | 'E' | 'S' | null;
export type NonNullFlamesResult = 'F' | 'L' | 'A' | 'M' | 'E' | 'S';

export interface ResultData {
  text: string;
  icon: LucideIcon;
  color: string;
  onColor: string;
  glowColor: string;
  confetti: {
    colors: string[];
    emojis: string[];
    strength: number;
    duration: number;
    spread: number;
  };
  emoji: string;
  particleCount: number;
  accessibilityLabel: string;
  quote: string;
  endText: string;
}

export const resultData: Record<NonNullFlamesResult, ResultData> = {
  [FlamesResultType.FRIEND]: {
    text: 'Friendship',
    icon: Users,
    color: 'var(--color-friendship-container)',
    onColor: 'var(--color-on-friendship-container)',
    glowColor: 'var(--color-friendship)',
    confetti: {
      colors: ['#C084FC', '#A78BFA', '#93C5FD', '#BFDBFE'],
      emojis: ['🤝', '⭐️', '🎉'],
      strength: 0.8,
      duration: 3000,
      spread: 70,
    },
    emoji: '🤝',
    particleCount: 80,
    accessibilityLabel: 'Friendship result with blue friendship symbols',
    quote: 'Best friends are the siblings we choose! 🤝',
    endText: 'friends',
  },
  [FlamesResultType.LOVE]: {
    text: 'Love',
    icon: Heart,
    color: 'var(--color-love-container)',
    onColor: 'var(--color-on-love-container)',
    glowColor: 'var(--color-love)',
    confetti: {
      colors: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
      emojis: ['❤️', '💘', '🌹'],
      strength: 1,
      duration: 4000,
      spread: 80,
    },
    emoji: '💘',
    particleCount: 100,
    accessibilityLabel: 'Love result with red heart symbols',
    quote: 'When two hearts beat as one! 💘',
    endText: 'lovers',
  },
  [FlamesResultType.AFFECTION]: {
    text: 'Affection',
    icon: Star,
    color: 'var(--color-affection-container)',
    onColor: 'var(--color-on-affection-container)',
    glowColor: 'var(--color-affection)',
    confetti: {
      colors: ['#FBBF24', '#F59E0B', '#FCD34D', '#FDE68A'],
      emojis: ['💕', '💖', '✨'],
      strength: 0.9,
      duration: 3500,
      spread: 75,
    },
    emoji: '✨',
    particleCount: 90,
    accessibilityLabel: 'Affection result with yellow star symbols',
    quote: 'The spark that keeps the flame alive! ✨',
    endText: 'affectionate',
  },
  [FlamesResultType.MARRIAGE]: {
    text: 'Marriage',
    icon: BellRing,
    color: 'var(--color-marriage-container)',
    onColor: 'var(--color-on-marriage-container)',
    glowColor: 'var(--color-marriage)',
    confetti: {
      colors: ['#C084FC', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      emojis: ['💍', '💑', '🎊'],
      strength: 1.1,
      duration: 4500,
      spread: 85,
    },
    emoji: '💍',
    particleCount: 110,
    accessibilityLabel: 'Marriage result with purple ring symbols',
    quote: 'Destined for a lifetime together! 💍',
    endText: 'married',
  },
  [FlamesResultType.ENEMY]: {
    text: 'Enemy',
    icon: Sword,
    color: 'var(--color-enemy-container)',
    onColor: 'var(--color-on-enemy-container)',
    glowColor: 'var(--color-enemy)',
    confetti: {
      colors: ['#EF4444', '#FB923C', '#FDBA74', '#FED7AA'],
      emojis: ['💣', '🔥', '😈'],
      strength: 1.2,
      duration: 3000,
      spread: 90,
    },
    emoji: '⚔️',
    particleCount: 70,
    accessibilityLabel: 'Enemy result with orange sword symbols',
    quote: 'That escalated quickly... 😅',
    endText: 'enemies',
  },
  [FlamesResultType.SIBLING]: {
    text: 'Siblings',
    icon: Users,
    color: 'var(--color-siblings-container)',
    onColor: 'var(--color-on-siblings-container)',
    glowColor: 'var(--color-siblings)',
    confetti: {
      colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
      emojis: ['🧸', '👫', '🎈'],
      strength: 0.9,
      duration: 3500,
      spread: 75,
    },
    emoji: '👪',
    particleCount: 85,
    accessibilityLabel: 'Siblings result with green family symbols',
    quote: 'Family vibes only! 👪',
    endText: 'siblings',
  },
};

export function getResultData(result: FlamesResult): ResultData {
  return result ? resultData[result] : resultData[FlamesResultType.FRIEND];
}
