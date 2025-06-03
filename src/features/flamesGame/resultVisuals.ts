import { BellRing, Heart, Star, Sword, Users } from 'lucide-react';
import React from 'react';
import { FlamesResult } from './flames.types';

export interface ResultVisualConfig {
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
  icon: React.ElementType;
  particleCount: number;
  accessibilityLabel: string; // Added for screen readers
  quote: string;
  endText: string;
}

// Define keys without null to satisfy TypeScript's Record type requirements
type NonNullFlamesResult = Exclude<FlamesResult, null>;

/**
 * Visual configurations for each FLAMES result
 * Aligned with the application's theme system while maintaining distinct identities
 */
export const resultVisuals: Record<NonNullFlamesResult, ResultVisualConfig> = {
  F: {
    // Friendship - Blue theme
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
    icon: Users,
    particleCount: 80,
    accessibilityLabel: 'Friendship result with blue friendship symbols',
    quote: 'Best friends are the siblings we choose! 🤝',
    endText: 'friends',
  },
  L: {
    // Love - Red theme aligned with primary colors
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
    icon: Heart,
    particleCount: 100,
    accessibilityLabel: 'Love result with red heart symbols',
    quote: 'When two hearts beat as one! 💘',
    endText: 'lovers',
  },
  A: {
    // Affection - Amber/Yellow theme
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
    icon: Star,
    particleCount: 90,
    accessibilityLabel: 'Affection result with yellow star symbols',
    quote: 'The spark that keeps the flame alive! ✨',
    endText: 'affectionate',
  },
  M: {
    // Marriage - Purple theme
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
    icon: BellRing,
    particleCount: 110,
    accessibilityLabel: 'Marriage result with purple ring symbols',
    quote: 'Destined for a lifetime together! 💍',
    endText: 'married',
  },
  E: {
    // Enemy - Orange theme aligned with error colors
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
    icon: Sword,
    particleCount: 70,
    accessibilityLabel: 'Enemy result with orange sword symbols',
    quote: 'That escalated quickly... 😅',
    endText: 'enemies',
  },
  S: {
    // Siblings - Green theme
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
    icon: Users,
    particleCount: 85,
    accessibilityLabel: 'Siblings result with green family symbols',
    quote: 'Family vibes only! 👪',
    endText: 'siblings',
  },
};

// Helper function to get visual config safely when result might be null
export function getResultVisuals(result: FlamesResult): ResultVisualConfig {
  // Default to 'F' when result is null
  return result ? resultVisuals[result] : resultVisuals.F;
}
