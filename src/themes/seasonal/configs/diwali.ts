import { SeasonalThemeConfig } from '../types';

export const diwaliTheme: SeasonalThemeConfig = {
  id: 'diwali',
  name: 'Diwali',
  description: 'Festival of Lights - diyas, rangoli, and warm golden hues',
  emoji: '🪔',
  region: 'india',
  dateRange: {
    // Diwali falls in Oct-Nov (varies each year, covering typical range)
    start: { month: 10, day: 15 },
    end: { month: 11, day: 15 },
  },
  colors: {
    // Light mode - warm golds, deep magentas, royal purples
    primary: '#FFB300', // Deep Gold/Amber
    primaryContainer: '#FFF3E0',
    secondary: '#D81B60', // Deep Magenta/Pink
    secondaryContainer: '#FCE4EC',
    accent: '#7B1FA2', // Royal Purple
    accentContainer: '#F3E5F5',
    background: '#FFFBF0',
    backgroundGradient: [
      'linear-gradient(135deg, #FFB300 0%, #FF8F00 25%, #D81B60 50%, #7B1FA2 75%, #4A148C 100%)',
      'linear-gradient(45deg, #FFF3E0 0%, #FCE4EC 50%, #F3E5F5 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#FFF8E1',
    text: '#3E2723',
    textSecondary: '#5D4037',
    border: '#FFB300',
  },
  darkModeColors: {
    primary: '#FFD54F', // Brighter gold for dark mode
    primaryContainer: '#5D4037',
    secondary: '#F48FB1', // Lighter pink for visibility
    secondaryContainer: '#880E4F',
    accent: '#CE93D8', // Lighter purple
    accentContainer: '#4A148C',
    background: '#1A1206',
    surface: '#2D1F0F',
    surfaceVariant: '#3E2723',
    text: '#FFF8E1',
    textSecondary: '#FFCC80',
    border: '#FFD54F',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 50,
      colors: ['#FFD54F', '#FFB300', '#FF8F00', '#F48FB1', '#CE93D8', '#FF6D00'],
      shapes: ['diya', 'sparkler', 'star', 'circle', 'rangoli'],
      size: { min: 8, max: 24 },
      speed: { min: 0.3, max: 1.5 },
      opacity: { min: 0.5, max: 1 },
      direction: 'up',
      animation: 'sparkle',
    },
    overlayPattern: '/patterns/diwali.png',
    overlayOpacity: 0.07,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/diwali/ambient.mp3',
    interactions: {
      click: '/sounds/themes/diwali/click.wav',
      hover: '/sounds/themes/diwali/hover.wav',
      success: '/sounds/themes/diwali/success.wav',
      error: '/sounds/themes/diwali/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/diwali/letter-strike.wav',
      flamesCount: '/sounds/themes/diwali/flames-count.wav',
      resultReveal: '/sounds/themes/diwali/result-reveal.wav',
      badgeUnlock: '/sounds/themes/diwali/badge-unlock.wav',
    },
  },
  customCSS: `
    .diwali-theme {
      --diya-flicker: diya-flicker 1.5s ease-in-out infinite;
      --sparkle-trail: sparkle-trail 2s linear infinite;
      --golden-glow: golden-glow 3s ease-in-out infinite alternate;
    }
    
    @keyframes diya-flicker {
      0%, 100% { 
        opacity: 1;
        filter: brightness(1) drop-shadow(0 0 8px rgba(255, 179, 0, 0.8));
      }
      25% { 
        opacity: 0.9;
        filter: brightness(1.1) drop-shadow(0 0 12px rgba(255, 143, 0, 0.9));
      }
      50% { 
        opacity: 1;
        filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 1));
      }
      75% { 
        opacity: 0.95;
        filter: brightness(1.1) drop-shadow(0 0 10px rgba(255, 179, 0, 0.85));
      }
    }
    
    @keyframes sparkle-trail {
      0% { 
        transform: translateY(0) rotate(0deg) scale(1);
        opacity: 1;
      }
      100% { 
        transform: translateY(-50px) rotate(180deg) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes golden-glow {
      0% { 
        box-shadow: 0 0 20px rgba(255, 179, 0, 0.3),
                    0 0 40px rgba(255, 143, 0, 0.2),
                    inset 0 0 20px rgba(255, 215, 0, 0.1);
      }
      100% { 
        box-shadow: 0 0 40px rgba(255, 179, 0, 0.5),
                    0 0 80px rgba(255, 143, 0, 0.4),
                    inset 0 0 30px rgba(255, 215, 0, 0.2);
      }
    }
    
    .diwali-theme .flames-letter {
      animation: var(--diya-flicker);
      text-shadow: 0 0 15px rgba(255, 179, 0, 0.7);
    }
    
    .diwali-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(255, 179, 0, 0.2) 0%, 
        rgba(216, 27, 96, 0.15) 50%, 
        rgba(123, 31, 162, 0.2) 100%);
      border: 2px solid rgba(255, 179, 0, 0.5);
      animation: var(--golden-glow);
    }
    
    .diwali-theme::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%);
      pointer-events: none;
      z-index: -1;
    }
  `,
  assets: {
    logo: '/assets/themes/diwali/logo.svg',
    background: '/assets/themes/diwali/background.jpg',
    patterns: [
      '/assets/themes/diwali/rangoli-pattern.svg',
      '/assets/themes/diwali/diya-pattern.svg',
      '/assets/themes/diwali/paisley-pattern.svg',
    ],
    icons: {
      diya: '/assets/themes/diwali/diya-icon.svg',
      rangoli: '/assets/themes/diwali/rangoli-icon.svg',
      sparkler: '/assets/themes/diwali/sparkler-icon.svg',
      firework: '/assets/themes/diwali/firework-icon.svg',
      lantern: '/assets/themes/diwali/lantern-icon.svg',
    },
  },
};
