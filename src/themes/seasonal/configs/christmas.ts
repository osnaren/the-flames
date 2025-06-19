import { SeasonalThemeConfig } from '../types';

export const christmasTheme: SeasonalThemeConfig = {
  id: 'christmas',
  name: 'Christmas',
  description: 'Festive winter theme with snow and holiday colors',
  dateRange: {
    start: { month: 12, day: 1 },
    end: { month: 12, day: 25 },
  },
  colors: {
    primary: '#DC143C',
    primaryContainer: '#2F5233',
    secondary: '#228B22',
    secondaryContainer: '#E8F5E8',
    accent: '#FFD700',
    accentContainer: '#FFF8DC',
    background: '#F0F8FF',
    backgroundGradient: [
      'linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 50%, #F0F8FF 100%)',
      'linear-gradient(45deg, #DC143C 0%, #228B22 50%, #FFD700 100%)',
    ],
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#555555',
    border: '#DC143C',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 40,
      colors: ['#FFFFFF', '#E6F3FF', '#FFD700', '#DC143C', '#228B22'],
      shapes: ['snowflake', 'star', 'circle'],
      size: { min: 6, max: 18 },
      speed: { min: 0.5, max: 2.5 },
      opacity: { min: 0.4, max: 0.9 },
      direction: 'down',
      animation: 'fall',
    },
    overlayPattern: '/patterns/snowflakes.svg',
    overlayOpacity: 0.06,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/christmas/ambient.mp3',
    interactions: {
      click: '/sounds/themes/christmas/click.wav',
      hover: '/sounds/themes/christmas/hover.wav',
      success: '/sounds/themes/christmas/success.wav',
      error: '/sounds/themes/christmas/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/christmas/letter-strike.wav',
      flamesCount: '/sounds/themes/christmas/flames-count.wav',
      resultReveal: '/sounds/themes/christmas/result-reveal.wav',
      badgeUnlock: '/sounds/themes/christmas/badge-unlock.wav',
    },
  },
  customCSS: `
    .christmas-theme {
      --twinkle-animation: twinkle 2s ease-in-out infinite;
      --snow-fall: snow-fall 10s linear infinite;
      --sparkle-animation: sparkle 3s ease-in-out infinite;
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.8); }
    }
    
    @keyframes snow-fall {
      0% { 
        transform: translateY(-100vh) translateX(0px) rotate(0deg);
        opacity: 0;
      }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { 
        transform: translateY(100vh) translateX(100px) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes sparkle {
      0%, 100% { 
        filter: brightness(1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
      }
      50% { 
        filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
      }
    }
    
    .christmas-theme .flames-letter {
      filter: drop-shadow(0 0 10px rgba(220, 20, 60, 0.4));
      animation: var(--twinkle-animation);
    }
    
    .christmas-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(220, 20, 60, 0.1) 0%, 
        rgba(34, 139, 34, 0.1) 50%, 
        rgba(255, 215, 0, 0.1) 100%);
      border: 1px solid rgba(220, 20, 60, 0.2);
      backdrop-filter: blur(10px);
    }
    
    .christmas-theme .snowflake {
      animation: var(--snow-fall);
      animation-delay: calc(var(--delay) * 1s);
    }
    
    .christmas-theme .gold-accent {
      animation: var(--sparkle-animation);
    }
    
    .christmas-theme::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/patterns/falling-snow.gif') repeat;
      opacity: 0.1;
      pointer-events: none;
      z-index: -1;
    }
  `,
  assets: {
    logo: '/assets/themes/christmas/logo.svg',
    background: '/assets/themes/christmas/background.jpg',
    patterns: [
      '/assets/themes/christmas/snowflakes-pattern.svg',
      '/assets/themes/christmas/holly-pattern.svg',
      '/assets/themes/christmas/candy-cane-pattern.svg',
    ],
    icons: {
      tree: '/assets/themes/christmas/tree-icon.svg',
      snowflake: '/assets/themes/christmas/snowflake-icon.svg',
      gift: '/assets/themes/christmas/gift-icon.svg',
      bell: '/assets/themes/christmas/bell-icon.svg',
      star: '/assets/themes/christmas/star-icon.svg',
      candy: '/assets/themes/christmas/candy-cane-icon.svg',
    },
  },
};
