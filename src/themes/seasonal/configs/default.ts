import { SeasonalThemeConfig } from '../types';

export const defaultTheme: SeasonalThemeConfig = {
  id: 'default',
  name: 'Default',
  description: 'Classic FLAMES theme with vibrant fire embers',
  emoji: '🔥',
  region: 'global',
  dateRange: {
    start: { month: 1, day: 1 },
    end: { month: 12, day: 31 },
  },
  colors: {
    primary: '#F97316', // Orange
    primaryContainer: '#FFF7ED',
    secondary: '#EF4444', // Red
    secondaryContainer: '#FEF2F2',
    accent: '#FBBF24', // Amber/Gold
    accentContainer: '#FFFBEB',
    background: '#FFFAF5',
    backgroundGradient: [
      'linear-gradient(135deg, #F97316 0%, #EF4444 25%, #F59E0B 50%, #DC2626 75%, #FBBF24 100%)',
      'linear-gradient(45deg, #FFF7ED 0%, #FEF2F2 50%, #FFFBEB 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#FFF7ED',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#FDBA74',
  },
  darkModeColors: {
    primary: '#FB923C', // Brighter orange for dark
    primaryContainer: '#7C2D12',
    secondary: '#F87171', // Lighter red for visibility
    secondaryContainer: '#7F1D1D',
    accent: '#FCD34D', // Brighter gold
    accentContainer: '#78350F',
    background: '#0C0A09',
    surface: '#1C1917',
    surfaceVariant: '#292524',
    text: '#FEF2F2',
    textSecondary: '#FED7AA',
    border: '#EA580C',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 50, // Increased count for ember effect
      colors: [
        '#F97316', // Orange
        '#EF4444', // Red
        '#FBBF24', // Amber
        '#FB923C', // Light Orange
        '#FCD34D', // Gold
        '#DC2626', // Deep Red
      ],
      shapes: ['circle'], // Only circles for embers
      size: { min: 2, max: 5 }, // Small size for embers
      speed: { min: 1, max: 3 }, // Slightly faster upward movement
      opacity: { min: 0.4, max: 0.8 },
      direction: 'up',
      animation: 'sparkle',
    },
    overlayPattern: undefined,
    overlayOpacity: 0,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    interactions: {
      click: '/sounds/click.wav',
      hover: '/sounds/hover.wav',
      success: '/sounds/success.wav',
      error: '/sounds/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/letter-strike.wav',
      flamesCount: '/sounds/flames-count.wav',
      resultReveal: '/sounds/result-reveal.wav',
      badgeUnlock: '/sounds/badge-unlock.wav',
    },
  },
  customCSS: `
    .default-theme {
      --smooth-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --ember-glow: ember-glow 2s ease-in-out infinite alternate;
      --fire-flicker: fire-flicker 1.5s ease-in-out infinite;
    }
    
    @keyframes ember-glow {
      0% { 
        filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.4));
      }
      100% { 
        filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.6));
      }
    }
    
    @keyframes fire-flicker {
      0%, 100% { 
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      25% { 
        opacity: 0.9;
        transform: scale(1.02) translateY(-1px);
      }
      50% { 
        opacity: 1;
        transform: scale(0.98) translateY(1px);
      }
      75% { 
        opacity: 0.95;
        transform: scale(1.01) translateY(-0.5px);
      }
    }
    
    .default-theme .flames-letter {
      transition: var(--smooth-transition);
      animation: var(--ember-glow);
    }
    
    .default-theme .flames-letter:hover {
      transform: translateY(-2px);
      filter: drop-shadow(0 4px 12px rgba(249, 115, 22, 0.5));
    }
    
    .default-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(249, 115, 22, 0.1) 0%, 
        rgba(239, 68, 68, 0.08) 50%, 
        rgba(251, 191, 36, 0.1) 100%);
      border: 1px solid rgba(249, 115, 22, 0.3);
      backdrop-filter: blur(10px);
      transition: var(--smooth-transition);
    }
    
    .default-theme .gradient-background {
      background: linear-gradient(135deg, 
        rgba(249, 115, 22, 0.15) 0%, 
        rgba(239, 68, 68, 0.12) 50%, 
        rgba(251, 191, 36, 0.15) 100%);
    }
  `,
  assets: {
    logo: '/assets/logo.svg',
    background: '/assets/background.jpg',
    patterns: [],
    icons: {
      flame: '/assets/flame-icon.svg',
      heart: '/assets/heart-icon.svg',
      star: '/assets/star-icon.svg',
    },
  },
};
