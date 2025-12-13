import { SeasonalThemeConfig } from '../types';

export const holiTheme: SeasonalThemeConfig = {
  id: 'holi',
  name: 'Holi',
  description: 'Festival of Colors - vibrant splashes of rainbow joy',
  emoji: '🎨',
  region: 'india',
  dateRange: {
    // Holi typically falls in March
    start: { month: 3, day: 1 },
    end: { month: 3, day: 20 },
  },
  colors: {
    // Light mode - vibrant rainbow colors
    primary: '#E91E63', // Vibrant Magenta/Pink
    primaryContainer: '#FCE4EC',
    secondary: '#00BCD4', // Cyan
    secondaryContainer: '#E0F7FA',
    accent: '#FFEB3B', // Bright Yellow
    accentContainer: '#FFFDE7',
    background: '#FFFEF8',
    backgroundGradient: [
      'linear-gradient(135deg, #E91E63 0%, #FF5722 20%, #FFEB3B 40%, #4CAF50 60%, #00BCD4 80%, #9C27B0 100%)',
      'linear-gradient(45deg, #FCE4EC 0%, #E0F7FA 25%, #FFFDE7 50%, #E8F5E9 75%, #F3E5F5 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#FFF8F0',
    text: '#212121',
    textSecondary: '#616161',
    border: '#E91E63',
  },
  darkModeColors: {
    primary: '#F48FB1', // Lighter pink for dark mode
    primaryContainer: '#880E4F',
    secondary: '#4DD0E1', // Brighter cyan
    secondaryContainer: '#006064',
    accent: '#FFF176', // Brighter yellow
    accentContainer: '#827717',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    surfaceVariant: '#3D3D3D',
    text: '#FAFAFA',
    textSecondary: '#BDBDBD',
    border: '#F48FB1',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 60,
      colors: [
        '#E91E63',
        '#FF5722',
        '#FFEB3B',
        '#4CAF50',
        '#00BCD4',
        '#9C27B0',
        '#673AB7',
        '#2196F3',
        '#FF9800',
        '#8BC34A',
      ],
      shapes: ['colorSplash', 'gulal', 'circle', 'waterBalloon'],
      size: { min: 10, max: 35 },
      speed: { min: 0.5, max: 2.5 },
      opacity: { min: 0.6, max: 1 },
      direction: 'random',
      animation: 'sparkle',
    },
    overlayPattern: '/patterns/color-splash.svg',
    overlayOpacity: 0.1,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/holi/ambient.mp3',
    interactions: {
      click: '/sounds/themes/holi/click.wav',
      hover: '/sounds/themes/holi/hover.wav',
      success: '/sounds/themes/holi/success.wav',
      error: '/sounds/themes/holi/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/holi/letter-strike.wav',
      flamesCount: '/sounds/themes/holi/flames-count.wav',
      resultReveal: '/sounds/themes/holi/result-reveal.wav',
      badgeUnlock: '/sounds/themes/holi/badge-unlock.wav',
    },
  },
  customCSS: `
    .holi-theme {
      --color-splash: color-splash 0.6s ease-out forwards;
      --rainbow-shift: rainbow-shift 8s linear infinite;
      --powder-burst: powder-burst 2s ease-out infinite;
    }
    
    @keyframes color-splash {
      0% { 
        transform: scale(0);
        opacity: 1;
      }
      50% { 
        transform: scale(1.5);
        opacity: 0.8;
      }
      100% { 
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes rainbow-shift {
      0% { 
        filter: hue-rotate(0deg);
      }
      100% { 
        filter: hue-rotate(360deg);
      }
    }
    
    @keyframes powder-burst {
      0% { 
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
      50% { 
        transform: scale(1.3) rotate(180deg);
        opacity: 0.8;
      }
      100% { 
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }
    }
    
    .holi-theme .flames-letter {
      animation: var(--rainbow-shift);
      text-shadow: 
        2px 2px 0 #E91E63,
        -2px -2px 0 #00BCD4,
        2px -2px 0 #FFEB3B,
        -2px 2px 0 #4CAF50;
    }
    
    .holi-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(233, 30, 99, 0.15) 0%, 
        rgba(0, 188, 212, 0.15) 33%, 
        rgba(255, 235, 59, 0.15) 66%, 
        rgba(156, 39, 176, 0.15) 100%);
      border: 2px solid transparent;
      background-clip: padding-box;
      position: relative;
    }
    
    .holi-theme .result-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, #E91E63, #00BCD4, #FFEB3B, #9C27B0);
      z-index: -1;
      border-radius: inherit;
      animation: var(--rainbow-shift);
    }
    
    .holi-theme::after {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 30%, rgba(233, 30, 99, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 80% 20%, rgba(0, 188, 212, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 60% 70%, rgba(255, 235, 59, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 30% 80%, rgba(156, 39, 176, 0.1) 0%, transparent 30%);
      pointer-events: none;
      z-index: -1;
    }
  `,
  assets: {
    logo: '/assets/themes/holi/logo.svg',
    background: '/assets/themes/holi/background.svg',
    patterns: [
      '/assets/themes/holi/splash-pattern.svg',
      '/assets/themes/holi/powder-pattern.svg',
      '/assets/themes/holi/dots-pattern.svg',
    ],
    icons: {
      splash: '/assets/themes/holi/splash-icon.svg',
      pichkari: '/assets/themes/holi/pichkari-icon.svg',
      gulal: '/assets/themes/holi/gulal-icon.svg',
      balloon: '/assets/themes/holi/balloon-icon.svg',
    },
  },
};
