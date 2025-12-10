import { SeasonalThemeConfig } from '../types';

export const newYearTheme: SeasonalThemeConfig = {
  id: 'newYear',
  name: 'New Year',
  description: 'Celebrate with fireworks, confetti, and champagne vibes',
  emoji: '🎆',
  region: 'global',
  dateRange: {
    start: { month: 12, day: 26 },
    end: { month: 1, day: 5 },
  },
  colors: {
    // Light mode colors - elegant gold and midnight blue
    primary: '#FFD700', // Gold
    primaryContainer: '#FFF8DC',
    secondary: '#1E3A5F', // Midnight Blue
    secondaryContainer: '#E8EEF4',
    accent: '#FF6B6B', // Coral/Rose
    accentContainer: '#FFE8E8',
    background: '#FFFEF7',
    backgroundGradient: [
      'linear-gradient(135deg, #1E3A5F 0%, #2C3E50 30%, #1A1A2E 60%, #16213E 100%)',
      'linear-gradient(45deg, #FFD700 0%, #FFA500 30%, #FF6B6B 60%, #E94560 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#F8F6F0',
    text: '#1A1A2E',
    textSecondary: '#4A4A6A',
    border: '#FFD700',
  },
  darkModeColors: {
    primary: '#FFD700',
    primaryContainer: '#3D3200',
    secondary: '#87CEEB',
    secondaryContainer: '#1E3A5F',
    accent: '#FF6B6B',
    accentContainer: '#4A1A1A',
    background: '#0D1117',
    surface: '#161B22',
    surfaceVariant: '#21262D',
    text: '#F0F6FC',
    textSecondary: '#8B949E',
    border: '#FFD700',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 45,
      colors: ['#FFD700', '#FFA500', '#FF6B6B', '#87CEEB', '#FFFFFF', '#E94560'],
      shapes: ['firework', 'confetti', 'star', 'circle'],
      size: { min: 4, max: 16 },
      speed: { min: 0.8, max: 3 },
      opacity: { min: 0.5, max: 1 },
      direction: 'up',
      animation: 'sparkle',
    },
    overlayPattern: '/patterns/fireworks.png',
    overlayOpacity: 0.08,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/newYear/ambient.mp3',
    interactions: {
      click: '/sounds/themes/newYear/click.wav',
      hover: '/sounds/themes/newYear/hover.wav',
      success: '/sounds/themes/newYear/success.wav',
      error: '/sounds/themes/newYear/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/newYear/letter-strike.wav',
      flamesCount: '/sounds/themes/newYear/flames-count.wav',
      resultReveal: '/sounds/themes/newYear/result-reveal.wav',
      badgeUnlock: '/sounds/themes/newYear/badge-unlock.wav',
    },
  },
  customCSS: `
    .newYear-theme {
      --firework-burst: firework-burst 2s ease-out infinite;
      --confetti-fall: confetti-fall 4s ease-in-out infinite;
      --sparkle-glow: sparkle-glow 1.5s ease-in-out infinite alternate;
    }
    
    @keyframes firework-burst {
      0% { 
        transform: scale(0) translateY(100px);
        opacity: 1;
      }
      50% { 
        transform: scale(1.2) translateY(-50px);
        opacity: 1;
      }
      100% { 
        transform: scale(0.8) translateY(-100px);
        opacity: 0;
      }
    }
    
    @keyframes confetti-fall {
      0% { 
        transform: translateY(-100%) rotate(0deg);
        opacity: 0;
      }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { 
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    @keyframes sparkle-glow {
      0% { 
        filter: brightness(1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
      }
      100% { 
        filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
      }
    }
    
    .newYear-theme .flames-letter {
      animation: var(--sparkle-glow);
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
    
    .newYear-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(255, 215, 0, 0.15) 0%, 
        rgba(30, 58, 95, 0.15) 50%, 
        rgba(255, 107, 107, 0.15) 100%);
      border: 1px solid rgba(255, 215, 0, 0.4);
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
    }
  `,
  assets: {
    logo: '/assets/themes/newYear/logo.svg',
    background: '/assets/themes/newYear/background.svg',
    patterns: [
      '/assets/themes/newYear/fireworks-pattern.svg',
      '/assets/themes/newYear/confetti-pattern.svg',
      '/assets/themes/newYear/stars-pattern.svg',
    ],
    icons: {
      firework: '/assets/themes/newYear/firework-icon.svg',
      champagne: '/assets/themes/newYear/champagne-icon.svg',
      clock: '/assets/themes/newYear/clock-icon.svg',
      confetti: '/assets/themes/newYear/confetti-icon.svg',
    },
  },
};
