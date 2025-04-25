import { FlamesResult } from './flames.types';
import React from 'react';
import { Users, Heart, Star, BellRing, Sword } from 'lucide-react';

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
 * Includes colors, icons, and accessibility labels
 */
export const resultVisuals: Record<NonNullFlamesResult, ResultVisualConfig> = {
  'F': {
    color: '#3B82F6', // blue-500
    darkColor: '#2563EB', // blue-600
    glowColor: 'rgba(59, 130, 246, 0.4)', // Enhanced blue-500 with opacity
    darkGlowColor: 'rgba(37, 99, 235, 0.5)', // Enhanced blue-600 with opacity
    confetti: {
      colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
      emojis: ['🤝', '⭐️', '🎉'],
      strength: 0.8,
      duration: 3000,
      spread: 70
    },
    emoji: '🤝',
    icon: Users,
    particleCount: 80,
    accessibilityLabel: 'Friendship result with blue friendship symbols'
  },
  'L': {
    color: '#EF4444', // red-500
    darkColor: '#DC2626', // red-600
    glowColor: 'rgba(239, 68, 68, 0.4)', // Enhanced red-500 with opacity
    darkGlowColor: 'rgba(220, 38, 38, 0.5)', // Enhanced red-600 with opacity
    confetti: {
      colors: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
      emojis: ['❤️', '💘', '🌹'],
      strength: 1,
      duration: 4000,
      spread: 80
    },
    emoji: '💘',
    icon: Heart,
    particleCount: 100,
    accessibilityLabel: 'Love result with red heart symbols'
  },
  'A': {
    color: '#F59E0B', // amber-500
    darkColor: '#D97706', // amber-600
    glowColor: 'rgba(245, 158, 11, 0.4)', // Enhanced amber-500 with opacity
    darkGlowColor: 'rgba(217, 119, 6, 0.5)', // Enhanced amber-600 with opacity
    confetti: {
      colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
      emojis: ['💕', '💖', '✨'],
      strength: 0.9,
      duration: 3500,
      spread: 75
    },
    emoji: '✨',
    icon: Star,
    particleCount: 90,
    accessibilityLabel: 'Affection result with yellow star symbols'
  },
  'M': {
    color: '#8B5CF6', // purple-500
    darkColor: '#7C3AED', // purple-600 
    glowColor: 'rgba(139, 92, 246, 0.4)', // Enhanced purple-500 with opacity
    darkGlowColor: 'rgba(124, 58, 237, 0.5)', // Enhanced purple-600 with opacity
    confetti: {
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      emojis: ['💍', '💑', '🎊'],
      strength: 1.1,
      duration: 4500,
      spread: 85
    },
    emoji: '💍',
    icon: BellRing,
    particleCount: 110,
    accessibilityLabel: 'Marriage result with purple ring symbols'
  },
  'E': {
    color: '#F97316', // orange-500
    darkColor: '#EA580C', // orange-600
    glowColor: 'rgba(249, 115, 22, 0.4)', // Enhanced orange-500 with opacity
    darkGlowColor: 'rgba(234, 88, 12, 0.5)', // Enhanced orange-600 with opacity
    confetti: {
      colors: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
      emojis: ['💣', '🔥', '😈'],
      strength: 1.2,
      duration: 3000,
      spread: 90
    },
    emoji: '⚔️',
    icon: Sword,
    particleCount: 70,
    accessibilityLabel: 'Enemy result with orange sword symbols'
  },
  'S': {
    color: '#10B981', // emerald-500
    darkColor: '#059669', // emerald-600
    glowColor: 'rgba(16, 185, 129, 0.4)', // Enhanced emerald-500 with opacity
    darkGlowColor: 'rgba(5, 150, 105, 0.5)', // Enhanced emerald-600 with opacity
    confetti: {
      colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
      emojis: ['🧸', '👫', '🎈'],
      strength: 0.9,
      duration: 3500,
      spread: 75
    },
    emoji: '👪',
    icon: Users,
    particleCount: 85,
    accessibilityLabel: 'Siblings result with green family symbols'
  }
};

// Helper function to get visual config safely when result might be null
export function getResultVisuals(result: FlamesResult): ResultVisualConfig {
  // Default to 'F' when result is null
  return result ? resultVisuals[result] : resultVisuals.F;
}