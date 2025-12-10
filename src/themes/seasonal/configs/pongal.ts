import { SeasonalThemeConfig } from '../types';

export const pongalTheme: SeasonalThemeConfig = {
  id: 'pongal',
  name: 'Pongal',
  description: 'Tamil harvest festival - kolam art, sugarcane, and earthy warmth',
  emoji: '🍯',
  region: 'india',
  dateRange: {
    // Pongal is celebrated January 14-17
    start: { month: 1, day: 10 },
    end: { month: 1, day: 20 },
  },
  colors: {
    // Light mode - earthy harvest colors: terracotta, turmeric, cream
    primary: '#CD853F', // Peru/Terracotta
    primaryContainer: '#FFEFD5',
    secondary: '#228B22', // Forest Green (sugarcane)
    secondaryContainer: '#E8F5E9',
    accent: '#FF8C00', // Dark Orange (turmeric)
    accentContainer: '#FFF3E0',
    background: '#FFFEF2',
    backgroundGradient: [
      'linear-gradient(135deg, #CD853F 0%, #DEB887 25%, #228B22 50%, #8FBC8F 75%, #FF8C00 100%)',
      'linear-gradient(45deg, #FFEFD5 0%, #E8F5E9 50%, #FFF3E0 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#FFF8E7',
    text: '#3E2723',
    textSecondary: '#6D4C41',
    border: '#CD853F',
  },
  darkModeColors: {
    primary: '#DEB887', // Burlywood - lighter terracotta
    primaryContainer: '#5D4037',
    secondary: '#90EE90', // Light green
    secondaryContainer: '#1B4D1B',
    accent: '#FFB74D', // Lighter orange
    accentContainer: '#8B4500',
    background: '#1A1408',
    surface: '#2D2418',
    surfaceVariant: '#3E3020',
    text: '#FFF8DC',
    textSecondary: '#D7CCC8',
    border: '#DEB887',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 30,
      colors: ['#CD853F', '#DEB887', '#228B22', '#90EE90', '#FF8C00', '#FFD700', '#FFEFD5'],
      shapes: ['sugarcane', 'pot', 'kolam', 'circle', 'star'],
      size: { min: 10, max: 26 },
      speed: { min: 0.2, max: 1 },
      opacity: { min: 0.5, max: 0.9 },
      direction: 'up',
      animation: 'float',
    },
    overlayPattern: '/patterns/pongal.jpg',
    overlayOpacity: 0.05,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/pongal/ambient.mp3',
    interactions: {
      click: '/sounds/themes/pongal/click.wav',
      hover: '/sounds/themes/pongal/hover.wav',
      success: '/sounds/themes/pongal/success.wav',
      error: '/sounds/themes/pongal/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/pongal/letter-strike.wav',
      flamesCount: '/sounds/themes/pongal/flames-count.wav',
      resultReveal: '/sounds/themes/pongal/result-reveal.wav',
      badgeUnlock: '/sounds/themes/pongal/badge-unlock.wav',
    },
  },
  customCSS: `
    .pongal-theme {
      --pot-bubble: pot-bubble 2s ease-in-out infinite;
      --kolam-draw: kolam-draw 4s ease-in-out infinite;
      --earthy-glow: earthy-glow 3s ease-in-out infinite alternate;
    }
    
    @keyframes pot-bubble {
      0%, 100% { 
        transform: translateY(0) scale(1);
      }
      50% { 
        transform: translateY(-5px) scale(1.05);
      }
    }
    
    @keyframes kolam-draw {
      0% { 
        stroke-dashoffset: 1000;
        opacity: 0.5;
      }
      50% { 
        stroke-dashoffset: 0;
        opacity: 1;
      }
      100% { 
        stroke-dashoffset: -1000;
        opacity: 0.5;
      }
    }
    
    @keyframes earthy-glow {
      0% { 
        box-shadow: 0 0 20px rgba(205, 133, 63, 0.2),
                    0 0 40px rgba(255, 140, 0, 0.1);
      }
      100% { 
        box-shadow: 0 0 30px rgba(205, 133, 63, 0.4),
                    0 0 60px rgba(255, 140, 0, 0.2);
      }
    }
    
    .pongal-theme .flames-letter {
      animation: var(--pot-bubble);
      text-shadow: 
        0 0 10px rgba(205, 133, 63, 0.5),
        0 2px 4px rgba(0, 0, 0, 0.1);
      background: linear-gradient(180deg, #CD853F, #DEB887, #CD853F);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .pongal-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(205, 133, 63, 0.15) 0%, 
        rgba(34, 139, 34, 0.12) 50%, 
        rgba(255, 140, 0, 0.15) 100%);
      border: 2px solid rgba(205, 133, 63, 0.4);
      animation: var(--earthy-glow);
    }
    
    .pongal-theme::before {
      content: '';
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(to top, rgba(205, 133, 63, 0.08) 0%, transparent 100%);
      pointer-events: none;
      z-index: -1;
    }
    
    .pongal-theme::after {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse at 30% 70%, rgba(205, 133, 63, 0.05) 0%, transparent 40%),
        radial-gradient(ellipse at 70% 30%, rgba(34, 139, 34, 0.05) 0%, transparent 40%);
      pointer-events: none;
      z-index: -1;
    }
  `,
  assets: {
    logo: '/assets/themes/pongal/logo.svg',
    background: '/assets/themes/pongal/background.svg',
    patterns: [
      '/assets/themes/pongal/kolam-pattern.svg',
      '/assets/themes/pongal/sugarcane-pattern.svg',
      '/assets/themes/pongal/pot-pattern.svg',
    ],
    icons: {
      pot: '/assets/themes/pongal/pot-icon.svg',
      sugarcane: '/assets/themes/pongal/sugarcane-icon.svg',
      kolam: '/assets/themes/pongal/kolam-icon.svg',
      sun: '/assets/themes/pongal/sun-icon.svg',
      cow: '/assets/themes/pongal/cow-icon.svg',
    },
  },
};
