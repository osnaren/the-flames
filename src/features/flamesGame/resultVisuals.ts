import { BellRing, Heart, Star, Sword, Users } from 'lucide-react';
import React from 'react';
import { FlamesResult } from './flames.types';

export interface ResultVisualConfig {
  color: string;
  darkColor: string;
  glowColor: string;
  darkGlowColor: string;
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
    color: 'var(--md-color-tertiary)',
    darkColor: 'var(--md-color-tertiary-container)',
    glowColor: 'rgba(139, 92, 246, 0.4)', // Purple with opacity for friendship
    darkGlowColor: 'rgba(124, 58, 237, 0.5)', // Darker purple with opacity
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
  },
  L: {
    // Love - Red theme aligned with primary colors
    color: 'var(--md-color-primary)',
    darkColor: 'var(--md-color-primary-container)',
    glowColor: 'rgba(249, 115, 22, 0.4)', // Primary container with opacity
    darkGlowColor: 'rgba(234, 88, 12, 0.5)', // Darker primary with opacity
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
  },
  A: {
    // Affection - Amber/Yellow theme aligned with secondary colors
    color: 'var(--md-color-secondary)',
    darkColor: 'var(--md-color-secondary-container)',
    glowColor: 'rgba(251, 191, 36, 0.4)', // Secondary container with opacity
    darkGlowColor: 'rgba(217, 119, 6, 0.5)', // Darker secondary with opacity
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
  },
  M: {
    // Marriage - Purple theme
    color: 'var(--md-color-tertiary)',
    darkColor: 'var(--md-color-tertiary-container)',
    glowColor: 'rgba(192, 132, 252, 0.4)', // Tertiary container with opacity
    darkGlowColor: 'rgba(168, 85, 247, 0.5)', // Darker tertiary with opacity
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
  },
  E: {
    // Enemy - Orange theme aligned with error colors
    color: 'var(--md-color-error)',
    darkColor: 'var(--md-color-error-container)',
    glowColor: 'rgba(239, 68, 68, 0.4)', // Error with opacity
    darkGlowColor: 'rgba(220, 38, 38, 0.5)', // Darker error with opacity
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
  },
  S: {
    // Siblings - Green theme
    color: 'var(--md-color-secondary-fixed)',
    darkColor: 'var(--md-color-secondary-fixed-dim)',
    glowColor: 'rgba(16, 185, 129, 0.4)', // Green with opacity
    darkGlowColor: 'rgba(5, 150, 105, 0.5)', // Darker green with opacity
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
  },
};

// Helper function to get visual config safely when result might be null
export function getResultVisuals(result: FlamesResult): ResultVisualConfig {
  // Default to 'F' when result is null
  return result ? resultVisuals[result] : resultVisuals.F;
}
