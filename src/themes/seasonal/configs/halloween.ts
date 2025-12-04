import { SeasonalThemeConfig } from '../types';

export const halloweenTheme: SeasonalThemeConfig = {
  id: 'halloween',
  name: 'Halloween',
  description: 'Spooky theme with dark colors and haunting effects',
  dateRange: {
    start: { month: 10, day: 1 },
    end: { month: 10, day: 31 },
  },
  colors: {
    primary: '#FF6600',
    primaryContainer: '#4A1810',
    secondary: '#9B4DCA',
    secondaryContainer: '#2D1B3D',
    accent: '#00FF94',
    accentContainer: '#0D2818',
    background: '#1A0B0F',
    backgroundGradient: [
      'linear-gradient(135deg, #1A0B0F 0%, #2D1B3D 50%, #4A1810 100%)',
      'linear-gradient(45deg, #FF6600 0%, #9B4DCA 50%, #00FF94 100%)',
    ],
    surface: '#2B1B1F',
    surfaceVariant: '#3D2B2F',
    text: '#E0E0E0',
    textSecondary: '#B0B0B0',
    border: '#FF6600',
  },
  backgroundEffects: {
    gradientAnimation: true,
    particleEffects: {
      enabled: true,
      count: 35,
      colors: ['#FF6600', '#9B4DCA', '#00FF94', '#FF4500', '#800080'],
      shapes: ['bat', 'pumpkin', 'star', 'circle'],
      size: { min: 12, max: 28 },
      speed: { min: 0.3, max: 1.5 },
      opacity: { min: 0.3, max: 0.8 },
      direction: 'random',
      animation: 'sparkle',
    },
    overlayPattern: '/patterns/spider-web.svg',
    overlayOpacity: 0.08,
    glowEffects: true,
    pulsing: true,
  },
  soundTheme: {
    background: '/sounds/themes/halloween/ambient.mp3',
    interactions: {
      click: '/sounds/themes/halloween/click.wav',
      hover: '/sounds/themes/halloween/hover.wav',
      success: '/sounds/themes/halloween/success.wav',
      error: '/sounds/themes/halloween/error.wav',
    },
    gameEvents: {
      letterStrike: '/sounds/themes/halloween/letter-strike.wav',
      flamesCount: '/sounds/themes/halloween/flames-count.wav',
      resultReveal: '/sounds/themes/halloween/result-reveal.wav',
      badgeUnlock: '/sounds/themes/halloween/badge-unlock.wav',
    },
  },
  customCSS: `
    .halloween-theme {
      --glow-animation: spooky-glow 3s ease-in-out infinite alternate;
      --float-animation: ghost-float 4s ease-in-out infinite;
    }
    
    @keyframes spooky-glow {
      0% { 
        box-shadow: 0 0 20px rgba(255, 102, 0, 0.3),
                    0 0 40px rgba(155, 77, 202, 0.2);
      }
      100% { 
        box-shadow: 0 0 30px rgba(255, 102, 0, 0.5),
                    0 0 60px rgba(155, 77, 202, 0.4);
      }
    }
    
    @keyframes ghost-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(1deg); }
    }
    
    .halloween-theme .flames-letter {
      filter: drop-shadow(0 0 15px rgba(255, 102, 0, 0.5));
      animation: var(--glow-animation);
    }
    
    .halloween-theme .result-card {
      background: linear-gradient(135deg, 
        rgba(255, 102, 0, 0.1) 0%, 
        rgba(155, 77, 202, 0.1) 50%, 
        rgba(0, 255, 148, 0.1) 100%);
      border: 1px solid rgba(255, 102, 0, 0.3);
      animation: var(--float-animation);
    }
    
    .halloween-theme .particle-bat {
      animation: bat-fly 6s linear infinite;
    }
    
    @keyframes bat-fly {
      0% { transform: translateX(-100px) scaleX(1); }
      50% { transform: translateX(50vw) scaleX(-1); }
      100% { transform: translateX(calc(100vw + 100px)) scaleX(1); }
    }
  `,
  assets: {
    logo: '/assets/themes/halloween/logo.svg',
    background: '/assets/themes/halloween/background.jpg',
    patterns: [
      '/assets/themes/halloween/spider-web-pattern.svg',
      '/assets/themes/halloween/bats-pattern.svg',
      '/assets/themes/halloween/pumpkins-pattern.svg',
    ],
    icons: {
      pumpkin: '/assets/themes/halloween/pumpkin-icon.svg',
      bat: '/assets/themes/halloween/bat-icon.svg',
      ghost: '/assets/themes/halloween/ghost-icon.svg',
      spider: '/assets/themes/halloween/spider-icon.svg',
      witch: '/assets/themes/halloween/witch-icon.svg',
    },
  },
};
