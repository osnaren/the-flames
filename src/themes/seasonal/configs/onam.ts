import { SeasonalThemeConfig } from '../types';

export const onamTheme: SeasonalThemeConfig = {
  id: 'onam',
  name: 'Onam',
  description: 'Kerala harvest festival - pookolam flowers and traditional elegance',
  emoji: '🌸',
  region: 'india',
  dateRange: {
    // Onam typically falls in August-September
    start: { month: 8, day: 15 },
    end: { month: 9, day: 15 },
  },
  colors: {
    // Light mode - traditional Kerala colors: gold, deep green, cream, marigold
    primary: '#DAA520', // Goldenrod
    primaryContainer: '#FFF8DC',
    secondary: '#228B22', // Forest Green
    secondaryContainer: '#E8F5E9',
    accent: '#FF6347', // Tomato Red (for flowers)
    accentContainer: '#FFEBE6',
    background: '#FFFEF5',
    backgroundGradient: [
      'linear-gradient(135deg, #DAA520 0%, #228B22 30%, #8FBC8F 60%, #F0E68C 100%)',
      'linear-gradient(45deg, #FFF8DC 0%, #E8F5E9 50%, #FFFEF5 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#FFFAEB',
    text: '#2D2D2D',
    textSecondary: '#5D5D5D',
    border: '#DAA520',
  },
  darkModeColors: {
    primary: '#FFD700', // Brighter gold
    primaryContainer: '#5D4E1A',
    secondary: '#90EE90', // Light green
    secondaryContainer: '#1B4D1B',
    accent: '#FF7F7F', // Lighter coral
    accentContainer: '#8B0000',
    background: '#0F1208',
    surface: '#1A1F14',
    surfaceVariant: '#2A3020',
    text: '#F5F5DC',
    textSecondary: '#C0C0A0',
    border: '#FFD700',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 35,
      colors: ['#DAA520', '#FFD700', '#228B22', '#90EE90', '#FF6347', '#FFA500', '#FFFF00'],
      shapes: ['flower', 'circle', 'star'],
      size: { min: 12, max: 28 },
      speed: { min: 0.2, max: 1.2 },
      opacity: { min: 0.5, max: 0.95 },
      direction: 'down',
      animation: 'float',
    },
    overlayPattern: '/patterns/onam.png',
    overlayOpacity: 0.06,
    glowEffects: true,
    pulsing: false, // More serene feel
  },
  soundTheme: {
    background: '/sounds/themes/onam/ambient.mp3',
    interactions: {
      click: '/sounds/themes/onam/click.wav',
      hover: '/sounds/themes/onam/hover.wav',
      success: '/sounds/themes/onam/success.wav',
      error: '/sounds/themes/onam/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/onam/letter-strike.wav',
      flamesCount: '/sounds/themes/onam/flames-count.wav',
      resultReveal: '/sounds/themes/onam/result-reveal.wav',
      badgeUnlock: '/sounds/themes/onam/badge-unlock.wav',
    },
  },
  customCSS: `
    .onam-theme {
      --petal-fall: petal-fall 6s ease-in-out infinite;
      --gentle-sway: gentle-sway 4s ease-in-out infinite;
      --golden-shimmer: golden-shimmer 3s ease-in-out infinite alternate;
    }
    
    @keyframes petal-fall {
      0% { 
        transform: translateY(-20px) translateX(0) rotate(0deg);
        opacity: 0;
      }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { 
        transform: translateY(100vh) translateX(50px) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes gentle-sway {
      0%, 100% { 
        transform: translateX(0) rotate(0deg);
      }
      25% { 
        transform: translateX(5px) rotate(2deg);
      }
      75% { 
        transform: translateX(-5px) rotate(-2deg);
      }
    }
    
    @keyframes golden-shimmer {
      0% { 
        background-position: -200% center;
        filter: brightness(1);
      }
      100% { 
        background-position: 200% center;
        filter: brightness(1.1);
      }
    }
    
    .onam-theme .flames-letter {
      animation: var(--gentle-sway);
      text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
      background: linear-gradient(90deg, #DAA520, #FFD700, #DAA520);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .onam-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(218, 165, 32, 0.15) 0%, 
        rgba(34, 139, 34, 0.12) 50%, 
        rgba(255, 99, 71, 0.15) 100%);
      border: 2px solid rgba(218, 165, 32, 0.4);
      box-shadow: 
        0 4px 20px rgba(218, 165, 32, 0.15),
        inset 0 0 30px rgba(255, 248, 220, 0.1);
    }
    
    .onam-theme::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse at 50% 0%, rgba(218, 165, 32, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 100%, rgba(34, 139, 34, 0.08) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
    }
  `,
  assets: {
    logo: '/assets/themes/onam/logo.svg',
    background: '/assets/themes/onam/background.svg',
    patterns: [
      '/assets/themes/onam/pookolam-pattern.svg',
      '/assets/themes/onam/flower-pattern.svg',
      '/assets/themes/onam/kasavu-pattern.svg',
    ],
    icons: {
      flower: '/assets/themes/onam/flower-icon.svg',
      banana: '/assets/themes/onam/banana-icon.svg',
      boat: '/assets/themes/onam/boat-icon.svg',
      umbrella: '/assets/themes/onam/umbrella-icon.svg',
      elephant: '/assets/themes/onam/elephant-icon.svg',
    },
  },
};
