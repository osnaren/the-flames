import { SeasonalThemeConfig } from '../types';

export const valentineTheme: SeasonalThemeConfig = {
  id: 'valentine',
  name: "Valentine's Day",
  description: 'Romantic theme with hearts and warm colors',
  dateRange: {
    start: { month: 2, day: 1 },
    end: { month: 2, day: 14 },
  },
  colors: {
    primary: '#FF6B9D',
    primaryContainer: '#FFE4E6',
    secondary: '#FF8E8E',
    secondaryContainer: '#FFF5F5',
    accent: '#FF4081',
    accentContainer: '#FFE0E6',
    background: '#FFF8F9',
    backgroundGradient: [
      'linear-gradient(135deg, #FFE4E6 0%, #FFF0F2 50%, #FFE4E6 100%)',
      'linear-gradient(45deg, #FF6B9D 0%, #FF8E8E 50%, #FF4081 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#FFF5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#FFB6C1',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 25,
      colors: ['#FF6B9D', '#FF8E8E', '#FF4081', '#FFB6C1', '#FFC0CB'],
      shapes: ['heart', 'circle'],
      size: { min: 8, max: 20 },
      speed: { min: 0.5, max: 2 },
      opacity: { min: 0.2, max: 0.7 },
      direction: 'swirl',
      animation: 'float',
    },
    overlayPattern: '/patterns/hearts.svg',
    overlayOpacity: 0.05,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/valentine/ambient.mp3',
    interactions: {
      click: '/sounds/themes/valentine/click.wav',
      hover: '/sounds/themes/valentine/hover.wav',
      success: '/sounds/themes/valentine/success.wav',
      error: '/sounds/themes/valentine/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/valentine/letter-strike.wav',
      flamesCount: '/sounds/themes/valentine/flames-count.wav',
      resultReveal: '/sounds/themes/valentine/result-reveal.wav',
      badgeUnlock: '/sounds/themes/valentine/badge-unlock.wav',
    },
  },
  customCSS: `
    .valentine-theme {
      --heart-animation: heartbeat 2s ease-in-out infinite;
    }
    
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .valentine-theme .flames-letter {
      filter: drop-shadow(0 0 10px rgba(255, 107, 157, 0.3));
    }
    
    .valentine-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(255, 107, 157, 0.1) 0%, 
        rgba(255, 142, 142, 0.1) 50%, 
        rgba(255, 64, 129, 0.1) 100%);
      border: 1px solid rgba(255, 107, 157, 0.2);
    }
  `,
  assets: {
    logo: '/assets/themes/valentine/logo.svg',
    background: '/assets/themes/valentine/background.jpg',
    patterns: ['/assets/themes/valentine/hearts-pattern.svg', '/assets/themes/valentine/cupid-pattern.svg'],
    icons: {
      heart: '/assets/themes/valentine/heart-icon.svg',
      cupid: '/assets/themes/valentine/cupid-icon.svg',
      rose: '/assets/themes/valentine/rose-icon.svg',
    },
  },
};
