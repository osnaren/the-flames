import { SeasonalThemeConfig } from '../types';

export const defaultTheme: SeasonalThemeConfig = {
  id: 'default',
  name: 'Default',
  description: 'Classic FLAMES theme with vibrant colors',
  dateRange: {
    start: { month: 1, day: 1 },
    end: { month: 12, day: 31 },
  },
  colors: {
    primary: '#F97316',
    primaryContainer: '#FFF7ED',
    secondary: '#8B5CF6',
    secondaryContainer: '#F3F4F6',
    accent: '#06B6D4',
    accentContainer: '#F0F9FF',
    background: '#FFFFFF',
    backgroundGradient: [
      'linear-gradient(135deg, #F97316 0%, #F59E0B 25%, #EAB308 50%, #84CC16 75%, #06B6D4 100%)',
      'linear-gradient(45deg, #FFF7ED 0%, #F3F4F6 50%, #F0F9FF 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#F9FAFB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 20,
      colors: ['#F97316', '#8B5CF6', '#06B6D4', '#EAB308', '#84CC16'],
      shapes: ['circle', 'star'],
      size: { min: 4, max: 12 },
      speed: { min: 0.5, max: 1.5 },
      opacity: { min: 0.2, max: 0.6 },
      direction: 'random',
      animation: 'float',
    },
    glowEffects: false,
    pulsing: false,
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
    }
    
    .default-theme .flames-letter {
      transition: var(--smooth-transition);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .default-theme .flames-letter:hover {
      transform: translateY(-2px);
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
    }
    
    .default-theme .result-card {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(229, 231, 235, 0.8);
      backdrop-filter: blur(10px);
      transition: var(--smooth-transition);
    }
    
    .default-theme .gradient-background {
      background: linear-gradient(135deg, 
        rgba(249, 115, 22, 0.1) 0%, 
        rgba(139, 92, 246, 0.1) 50%, 
        rgba(6, 182, 212, 0.1) 100%);
    }
  `,
  assets: {
    logo: '/assets/logo.svg',
    background: '/assets/background.jpg',
    patterns: ['/patterns/default-pattern.svg'],
    icons: {
      flame: '/assets/flame-icon.svg',
      heart: '/assets/heart-icon.svg',
      star: '/assets/star-icon.svg',
    },
  },
};
