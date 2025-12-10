'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useBackgroundStore } from '@/store/useBackgroundStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { ParticleShape } from '@/themes/seasonal/types';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { colorToRgbaPrefix } from '@/utils/colorUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// --- Types ---

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  shape: ParticleShape;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

// --- Shape Drawing Functions ---

const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
  const width = size;
  const height = size;
  ctx.beginPath();
  const topCurveHeight = height * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -width / 2, 0, -width / 2, topCurveHeight);
  ctx.bezierCurveTo(-width / 2, (height + topCurveHeight) / 2, 0, (height + topCurveHeight) / 2, 0, height);
  ctx.bezierCurveTo(
    0,
    (height + topCurveHeight) / 2,
    width / 2,
    (height + topCurveHeight) / 2,
    width / 2,
    topCurveHeight
  );
  ctx.bezierCurveTo(width / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.fill();
};

const drawStar = (ctx: CanvasRenderingContext2D, size: number, points: number) => {
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
};

const drawSnowflake = (ctx: CanvasRenderingContext2D, size: number) => {
  const radius = size / 2;
  ctx.lineWidth = Math.max(1, size / 10);

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Main branch
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Sub-branches for more detailed snowflake
    const branchLength = radius * 0.3;
    const branchPoint = 0.7;
    const branchAngle1 = angle + Math.PI / 6;
    const branchAngle2 = angle - Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(x * branchPoint, y * branchPoint);
    ctx.lineTo(
      x * branchPoint + Math.cos(branchAngle1) * branchLength,
      y * branchPoint + Math.sin(branchAngle1) * branchLength
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x * branchPoint, y * branchPoint);
    ctx.lineTo(
      x * branchPoint + Math.cos(branchAngle2) * branchLength,
      y * branchPoint + Math.sin(branchAngle2) * branchLength
    );
    ctx.stroke();
  }
};

const drawPumpkin = (ctx: CanvasRenderingContext2D, size: number) => {
  const width = size;
  const height = size;
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Vertical lines for pumpkin ridges
  const ridgeColor = ctx.fillStyle;
  ctx.strokeStyle = typeof ridgeColor === 'string' ? ridgeColor : '#ff6600';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo((i * width) / 6, -height / 2);
    ctx.lineTo((i * width) / 6, height / 2);
    ctx.stroke();
  }
};

const drawBat = (ctx: CanvasRenderingContext2D, size: number) => {
  const width = size;
  const height = size * 0.6;
  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 8, height / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Left wing
  ctx.beginPath();
  ctx.moveTo(-width / 8, 0);
  ctx.quadraticCurveTo(-width / 3, -height / 3, -width / 2, 0);
  ctx.quadraticCurveTo(-width / 3, height / 4, -width / 8, 0);
  ctx.fill();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(width / 8, 0);
  ctx.quadraticCurveTo(width / 3, -height / 3, width / 2, 0);
  ctx.quadraticCurveTo(width / 3, height / 4, width / 8, 0);
  ctx.fill();
};

const drawFlame = (ctx: CanvasRenderingContext2D, size: number) => {
  const w = size;
  const h = size * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.quadraticCurveTo(w / 2, 0, w / 3, h / 2);
  ctx.quadraticCurveTo(0, h * 0.3, -w / 3, h / 2);
  ctx.quadraticCurveTo(-w / 2, 0, 0, -h / 2);
  ctx.fill();
};

// --- New Year Shapes ---

const drawFirework = (ctx: CanvasRenderingContext2D, size: number) => {
  const rays = 8;
  const outerRadius = size / 2;
  const innerRadius = size / 6;
  ctx.lineWidth = Math.max(1, size / 12);
  
  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
    ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
    ctx.stroke();
    
    // Sparkle dots at ends
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, size / 10, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawConfetti = (ctx: CanvasRenderingContext2D, size: number) => {
  // Random rectangular confetti piece
  const w = size * 0.4;
  const h = size;
  ctx.fillRect(-w / 2, -h / 2, w, h);
};

const drawChampagne = (ctx: CanvasRenderingContext2D, size: number) => {
  // Champagne bubble
  ctx.beginPath();
  ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
  ctx.fill();
  // Highlight
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(-size / 8, -size / 8, size / 8, 0, Math.PI * 2);
  ctx.fill();
};

// --- Diwali Shapes ---

const drawDiya = (ctx: CanvasRenderingContext2D, size: number) => {
  const w = size;
  const h = size * 0.6;
  
  // Oil lamp base
  ctx.beginPath();
  ctx.ellipse(0, h / 4, w / 2, h / 4, 0, 0, Math.PI);
  ctx.fill();
  
  // Flame
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.quadraticCurveTo(w / 4, -h / 4, w / 6, 0);
  ctx.quadraticCurveTo(0, -h / 6, -w / 6, 0);
  ctx.quadraticCurveTo(-w / 4, -h / 4, 0, -h / 2);
  ctx.fill();
};

const drawRangoli = (ctx: CanvasRenderingContext2D, size: number) => {
  const radius = size / 2;
  const petals = 6;
  
  // Central circle
  ctx.beginPath();
  ctx.arc(0, 0, radius / 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Petal pattern
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(radius / 2, 0, radius / 3, radius / 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

const drawSparkler = (ctx: CanvasRenderingContext2D, size: number) => {
  const rays = 12;
  const radius = size / 2;
  ctx.lineWidth = Math.max(1, size / 15);
  
  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays;
    const length = (i % 2 === 0) ? radius : radius * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.stroke();
  }
};

// --- Holi Shapes ---

const drawColorSplash = (ctx: CanvasRenderingContext2D, size: number) => {
  // Irregular splash shape
  const points = 8;
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = (i * Math.PI * 2) / points;
    const variance = 0.5 + Math.random() * 0.5;
    const r = (size / 2) * variance;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.quadraticCurveTo(
      Math.cos(angle - Math.PI / points) * (size / 2) * 1.2,
      Math.sin(angle - Math.PI / points) * (size / 2) * 1.2,
      x, y
    );
  }
  ctx.closePath();
  ctx.fill();
};

const drawGulal = (ctx: CanvasRenderingContext2D, size: number) => {
  // Powder cloud - multiple overlapping circles
  const circles = 5;
  for (let i = 0; i < circles; i++) {
    const offsetX = (Math.random() - 0.5) * size * 0.4;
    const offsetY = (Math.random() - 0.5) * size * 0.4;
    const r = (size / 4) * (0.5 + Math.random() * 0.5);
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, r, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawWaterBalloon = (ctx: CanvasRenderingContext2D, size: number) => {
  const w = size * 0.8;
  const h = size;
  
  // Balloon body
  ctx.beginPath();
  ctx.ellipse(0, size / 6, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Balloon knot
  ctx.beginPath();
  ctx.moveTo(-w / 8, -h / 2 + size / 6);
  ctx.lineTo(0, -h / 2 - size / 10 + size / 6);
  ctx.lineTo(w / 8, -h / 2 + size / 6);
  ctx.fill();
};

// --- Onam Shapes ---

const drawFlower = (ctx: CanvasRenderingContext2D, size: number) => {
  const petals = 5;
  const radius = size / 2;
  
  // Petals
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals - Math.PI / 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -radius / 2, radius / 4, radius / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Center
  ctx.beginPath();
  ctx.arc(0, 0, radius / 4, 0, Math.PI * 2);
  ctx.fill();
};

const drawBanana = (ctx: CanvasRenderingContext2D, size: number) => {
  const w = size;
  const h = size * 0.4;
  
  // Curved banana shape
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.quadraticCurveTo(-w / 4, -h, w / 4, -h / 2);
  ctx.quadraticCurveTo(w / 2, 0, w / 4, h / 2);
  ctx.quadraticCurveTo(-w / 4, h / 2, -w / 2, 0);
  ctx.fill();
};

const drawUmbrella = (ctx: CanvasRenderingContext2D, size: number) => {
  const radius = size / 2;
  
  // Umbrella top (half circle)
  ctx.beginPath();
  ctx.arc(0, 0, radius, Math.PI, 0);
  ctx.fill();
  
  // Handle
  ctx.lineWidth = size / 12;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, radius * 0.8);
  ctx.quadraticCurveTo(0, radius, -radius / 4, radius);
  ctx.stroke();
};

// --- Pongal Shapes ---

const drawSugarcane = (ctx: CanvasRenderingContext2D, size: number) => {
  const w = size / 4;
  const h = size;
  const segments = 4;
  
  // Draw segments
  for (let i = 0; i < segments; i++) {
    const y = -h / 2 + (i * h) / segments;
    ctx.fillRect(-w / 2, y, w, h / segments - 2);
  }
  
  // Leaves at top
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.quadraticCurveTo(w, -h / 2 - size / 4, w / 2, -h / 2 - size / 3);
  ctx.quadraticCurveTo(-w / 2, -h / 2 - size / 4, 0, -h / 2);
  ctx.fill();
};

const drawPot = (ctx: CanvasRenderingContext2D, size: number) => {
  const w = size;
  const h = size * 0.8;
  
  // Pot body
  ctx.beginPath();
  ctx.moveTo(-w / 3, -h / 3);
  ctx.quadraticCurveTo(-w / 2, 0, -w / 3, h / 3);
  ctx.lineTo(w / 3, h / 3);
  ctx.quadraticCurveTo(w / 2, 0, w / 3, -h / 3);
  ctx.closePath();
  ctx.fill();
  
  // Rim
  ctx.beginPath();
  ctx.ellipse(0, -h / 3, w / 3, h / 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Overflowing rice/pongal
  ctx.beginPath();
  ctx.arc(0, -h / 3 - h / 10, w / 5, 0, Math.PI * 2);
  ctx.fill();
};

const drawKolam = (ctx: CanvasRenderingContext2D, size: number) => {
  const radius = size / 2;
  ctx.lineWidth = Math.max(1, size / 10);
  
  // Concentric pattern
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  
  // Dots at corners
  const dots = 4;
  for (let i = 0; i < dots; i++) {
    const angle = (i * Math.PI * 2) / dots;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * radius * 0.8, Math.sin(angle) * radius * 0.8, size / 10, 0, Math.PI * 2);
    ctx.fill();
  }
};

// --- Helper: Get Theme Colors for Canvas ---

function getThemeColors(isDark: boolean): string[] {
  if (typeof window === 'undefined') return [];

  const computedStyle = getComputedStyle(document.documentElement);

  // Use vibrant primary colors for both modes
  // Light mode uses the main colors, dark mode uses fixed variants for better contrast
  const colorVars = isDark
    ? [
        '--md-color-primary',
        '--md-color-secondary',
        '--md-color-tertiary',
        '--md-color-primary-fixed',
        '--md-color-secondary-fixed',
      ]
    : [
        '--md-color-primary',
        '--md-color-secondary',
        '--md-color-tertiary',
        '--md-color-primary',
        '--md-color-tertiary',
      ];

  const colors: string[] = [];
  // Good opacity for both modes - light mode needs vibrant colors too!
  const baseOpacity = isDark ? 0.85 : 0.75;

  for (const varName of colorVars) {
    const value = computedStyle.getPropertyValue(varName).trim();
    if (value) {
      const rgbaPrefix = colorToRgbaPrefix(value);
      if (rgbaPrefix && !rgbaPrefix.includes('0, 0, 0')) {
        colors.push(rgbaPrefix + baseOpacity + ')');
      }
    }
  }

  // Fallback colors with vibrant opacity
  if (colors.length === 0) {
    const opacity = isDark ? 0.85 : 0.75;
    return [`rgba(249, 115, 22, ${opacity})`, `rgba(139, 92, 246, ${opacity})`, `rgba(6, 182, 212, ${opacity})`];
  }

  return colors;
}

// --- Main Component ---

function UnifiedBackground() {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const { isMobile, isLowPowerMode } = useDeviceCapabilities();
  const { currentThemeConfig, currentTheme } = useSeasonalTheme();
  const { variant, result, intensity } = useBackgroundStore();
  const { isDarkTheme } = usePreferencesStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef<number>(0);
  const targetFPS = isLowPowerMode ? 15 : isMobile ? 24 : 30;
  const frameInterval = 1000 / targetFPS;

  // --- Dynamic Colors State ---
  const [canvasColors, setCanvasColors] = useState<string[]>([]);

  // Update canvas colors when theme changes
  useEffect(() => {
    // Small delay to ensure DOM has updated with new theme class
    const timer = setTimeout(() => {
      if (variant === 'default') {
        const colors = getThemeColors(isDarkTheme);
        if (colors.length > 0) {
          setCanvasColors(colors);
        } else {
          // Adjust seasonal theme colors for dark mode
          let themeColors = currentThemeConfig.backgroundEffects.particleEffects.colors;
          if (isDarkTheme) {
            // Boost opacity and ensure colors are visible on dark backgrounds
            themeColors = themeColors.map((color) => {
              if (color.startsWith('rgba')) {
                return color.replace(/[\d.]+\)$/, '0.85)');
              }
              // Convert hex to rgba with higher opacity
              return color;
            });
          }
          setCanvasColors(themeColors);
        }
      } else {
        // For processing/result modes, use the specific config colors
        setCanvasColors(currentThemeConfig.backgroundEffects.particleEffects.colors);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isDarkTheme, variant, currentThemeConfig, currentTheme]);

  // --- Configuration Logic ---

  const config = useMemo(() => {
    let intensityMultiplier = intensity === 'high' ? 1.5 : intensity === 'low' ? 0.5 : 1;

    // Reduce intensity for mobile/low power
    if (isMobile) intensityMultiplier *= 0.6;
    if (isLowPowerMode) intensityMultiplier *= 0.5;

    const themeParticles = currentThemeConfig.backgroundEffects.particleEffects;

    // Base config from seasonal theme
    let particleConfig = {
      enabled: themeParticles.enabled,
      count: Math.floor(themeParticles.count * intensityMultiplier),
      colors: canvasColors.length > 0 ? canvasColors : themeParticles.colors,
      shapes: themeParticles.shapes,
      size: themeParticles.size,
      speed: themeParticles.speed,
      direction: themeParticles.direction,
      opacity: themeParticles.opacity,
      animation: themeParticles.animation,
    };

    // Overrides based on Variant
    if (variant === 'processing') {
      particleConfig = {
        enabled: true,
        count: Math.floor(50 * intensityMultiplier),
        colors: ['rgba(249, 115, 22, 0.8)', 'rgba(234, 88, 12, 0.7)', 'rgba(254, 215, 170, 0.6)'],
        shapes: ['flame', 'circle'] as ParticleShape[],
        size: { min: 2, max: 6 },
        speed: { min: 2, max: 5 },
        direction: 'up',
        opacity: { min: 0.4, max: 0.8 },
        animation: 'sparkle',
      };
    } else if (variant === 'result' && result) {
      const resultColors: Record<string, string[]> = {
        F: ['rgba(255, 215, 0, 0.8)', 'rgba(255, 165, 0, 0.7)'],
        L: ['rgba(236, 72, 153, 0.8)', 'rgba(244, 114, 182, 0.7)'],
        A: ['rgba(168, 85, 247, 0.8)', 'rgba(192, 132, 252, 0.7)'],
        M: ['rgba(16, 185, 129, 0.8)', 'rgba(52, 211, 153, 0.7)'],
        E: ['rgba(239, 68, 68, 0.8)', 'rgba(248, 113, 113, 0.7)'],
        S: ['rgba(59, 130, 246, 0.8)', 'rgba(96, 165, 250, 0.7)'],
      };

      const resultShapesMap: Record<string, ParticleShape[]> = {
        F: ['star', 'circle'],
        L: ['heart'],
        A: ['heart', 'circle'],
        M: ['circle', 'star'],
        E: ['flame', 'circle'],
        S: ['circle'],
      };

      particleConfig = {
        enabled: true,
        count: Math.floor(60 * intensityMultiplier),
        colors: resultColors[result] || ['rgba(255, 255, 255, 0.8)'],
        shapes: resultShapesMap[result] || ['circle'],
        size: { min: 3, max: 8 },
        speed: { min: 1, max: 3 },
        direction: 'up',
        opacity: { min: 0.5, max: 0.9 },
        animation: 'sparkle',
      };
    }

    return particleConfig;
  }, [variant, result, intensity, currentThemeConfig, isMobile, isLowPowerMode, canvasColors]);

  // Background effect config from theme
  const bgEffects = currentThemeConfig.backgroundEffects;

  // --- Particle System ---

  const createParticle = useCallback((width: number, height: number, cfg: typeof config): Particle => {
    const direction = cfg.direction;
    let speedY = Math.random() * (cfg.speed.max - cfg.speed.min) + cfg.speed.min;

    if (direction === 'up') speedY = -speedY;
    else if (direction === 'down') speedY = Math.abs(speedY);
    else if (direction === 'random') speedY = (Math.random() - 0.5) * cfg.speed.max * 2;

    return {
      id: Math.random(),
      x: Math.random() * width,
      y: direction === 'up' ? height + 20 : direction === 'down' ? -20 : Math.random() * height,
      size: Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min,
      speedX: direction === 'swirl' ? (Math.random() - 0.5) * cfg.speed.max : (Math.random() - 0.5) * 0.5,
      speedY,
      opacity: Math.random() * (cfg.opacity.max - cfg.opacity.min) + cfg.opacity.min,
      shape: cfg.shapes[Math.floor(Math.random() * cfg.shapes.length)],
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      life: 1,
      maxLife: 1,
    };
  }, []);

  const initParticles = useCallback(() => {
    if (!config.enabled || !shouldAnimate) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width / (window.devicePixelRatio || 1) : window.innerWidth;
    const height = canvas ? canvas.height / (window.devicePixelRatio || 1) : window.innerHeight;

    const newParticles: Particle[] = [];
    for (let i = 0; i < config.count; i++) {
      const p = createParticle(width, height, config);
      // For initial spawn, distribute across the screen
      p.y = Math.random() * height;
      newParticles.push(p);
    }
    particlesRef.current = newParticles;
  }, [config, shouldAnimate, createParticle]);

  // Re-init particles when config changes significantly
  useEffect(() => {
    initParticles();
  }, [initParticles]);

  // Visibility Handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden) lastFrameTimeRef.current = 0;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!shouldAnimate || !config.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      if (!isVisibleRef.current) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      if (timestamp - lastFrameTimeRef.current < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Update and Draw particles
      particlesRef.current.forEach((p) => {
        // Movement based on direction
        if (config.direction === 'swirl') {
          p.rotation += p.rotationSpeed;
          p.x += Math.cos(p.rotation * 0.05) * p.speedX;
          p.y += Math.sin(p.rotation * 0.05) * Math.abs(p.speedY) * 0.5;
        } else {
          p.x += p.speedX;
          p.y += p.speedY;
        }

        p.rotation += p.rotationSpeed;

        // Sparkle animation
        if (config.animation === 'sparkle') {
          p.opacity =
            Math.abs(Math.sin(timestamp * 0.002 + p.id * 10)) * (config.opacity.max - config.opacity.min) +
            config.opacity.min;
        }

        // Wrap around
        if (p.y < -50) {
          p.y = height + 50;
          p.x = Math.random() * width;
        } else if (p.y > height + 50) {
          p.y = -50;
          p.x = Math.random() * width;
        }
        if (p.x < -50) p.x = width + 50;
        else if (p.x > width + 50) p.x = -50;

        // Drawing
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // Enhanced visibility for both modes
        const opacityBoost = isDarkTheme ? 1.3 : 1.15;
        ctx.globalAlpha = Math.min(p.opacity * opacityBoost, 1);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        // Glow effect for both modes - makes particles pop!
        ctx.shadowBlur = isDarkTheme ? 25 : 18;
        ctx.shadowColor = p.color;

        switch (p.shape) {
          case 'heart':
            drawHeart(ctx, p.size);
            break;
          case 'star':
            drawStar(ctx, p.size, 5);
            break;
          case 'snowflake':
            drawSnowflake(ctx, p.size);
            break;
          case 'pumpkin':
            drawPumpkin(ctx, p.size);
            break;
          case 'bat':
            drawBat(ctx, p.size);
            break;
          case 'flame':
            drawFlame(ctx, p.size);
            break;
          // New Year shapes
          case 'firework':
            drawFirework(ctx, p.size);
            break;
          case 'confetti':
            drawConfetti(ctx, p.size);
            break;
          case 'champagne':
            drawChampagne(ctx, p.size);
            break;
          // Diwali shapes
          case 'diya':
            drawDiya(ctx, p.size);
            break;
          case 'rangoli':
            drawRangoli(ctx, p.size);
            break;
          case 'sparkler':
            drawSparkler(ctx, p.size);
            break;
          // Holi shapes
          case 'colorSplash':
            drawColorSplash(ctx, p.size);
            break;
          case 'gulal':
            drawGulal(ctx, p.size);
            break;
          case 'waterBalloon':
            drawWaterBalloon(ctx, p.size);
            break;
          // Onam shapes
          case 'flower':
            drawFlower(ctx, p.size);
            break;
          case 'banana':
            drawBanana(ctx, p.size);
            break;
          case 'umbrella':
            drawUmbrella(ctx, p.size);
            break;
          // Pongal shapes
          case 'sugarcane':
            drawSugarcane(ctx, p.size);
            break;
          case 'pot':
            drawPot(ctx, p.size);
            break;
          case 'kolam':
            drawKolam(ctx, p.size);
            break;
          default:
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
      });

      ctx.restore();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Resize Handler
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [shouldAnimate, config, frameInterval, isDarkTheme, bgEffects.glowEffects]);

  // --- Render ---

  // Static background for reduced motion
  if (!shouldAnimate || prefersReducedMotion) {
    return (
      <div className="bg-background fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-5 dark:opacity-[0.03]" />
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-linear-to-br" />
      </div>
    );
  }

  // Get gradient colors for orbs
  const primaryColor = currentThemeConfig.colors.primary;
  const secondaryColor = currentThemeConfig.colors.secondary;
  const accentColor = currentThemeConfig.colors.accent;

  return (
    <div className="bg-background fixed inset-0 z-0 overflow-hidden transition-colors duration-700">
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-5 dark:opacity-[0.03]" />

      {/* Glow Radial Effects - Always on for vibrant look */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 15% 15%, ${primaryColor}${isDarkTheme ? '55' : '50'} 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, ${secondaryColor}${isDarkTheme ? '55' : '50'} 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, ${accentColor}${isDarkTheme ? '45' : '40'} 0%, transparent 55%),
            radial-gradient(circle at 75% 25%, ${primaryColor}${isDarkTheme ? '35' : '30'} 0%, transparent 40%),
            radial-gradient(circle at 25% 75%, ${secondaryColor}${isDarkTheme ? '35' : '30'} 0%, transparent 40%)
          `,
          filter: 'blur(80px)',
          opacity: isDarkTheme ? 0.5 : 0.45,
        }}
      />

      {/* Pattern Overlay */}
      {bgEffects.overlayPattern && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${bgEffects.overlayPattern})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: bgEffects.overlayOpacity || 0.05,
          }}
        />
      )}

      {/* Light Mode Shimmer - adds liveliness */}
      {!isDarkTheme && shouldAnimate && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              transparent 0%, 
              ${primaryColor}15 25%, 
              transparent 50%, 
              ${secondaryColor}12 75%, 
              transparent 100%
            )`,
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Pulsing Overlay */}
      {bgEffects.pulsing && shouldAnimate && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primaryColor}${isDarkTheme ? '20' : '25'} 0%, transparent 65%)`,
          }}
          animate={{
            opacity: isDarkTheme ? [0.4, 0.7, 0.4] : [0.35, 0.6, 0.35],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Ambient Orbs */}
      <AnimatePresence mode="wait">
        {variant === 'default' && (
          <>
            <motion.div
              key="orb-1"
              className="absolute rounded-full blur-3xl"
              style={{
                width: 400,
                height: 400,
                left: '20%',
                top: '20%',
                background: isDarkTheme ? `${primaryColor}55` : `${primaryColor}45`,
              }}
              animate={{
                scale: [1, 1.25, 1],
                opacity: isDarkTheme ? [0.5, 0.8, 0.5] : [0.4, 0.65, 0.4],
                x: [0, 40, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.div
              key="orb-2"
              className="absolute rounded-full blur-3xl"
              style={{
                width: 350,
                height: 350,
                right: '15%',
                bottom: '25%',
                background: isDarkTheme ? `${secondaryColor}50` : `${secondaryColor}40`,
              }}
              animate={{
                scale: [1, 1.35, 1],
                opacity: isDarkTheme ? [0.4, 0.7, 0.4] : [0.35, 0.55, 0.35],
                x: [0, -30, 0],
                y: [0, 35, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
            />
            <motion.div
              key="orb-3"
              className="absolute rounded-full blur-3xl"
              style={{
                width: 300,
                height: 300,
                left: '55%',
                top: '55%',
                background: isDarkTheme ? `${accentColor}45` : `${accentColor}35`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: isDarkTheme ? [0.35, 0.6, 0.35] : [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
            />
            {/* Extra orb for more depth */}
            <motion.div
              key="orb-4"
              className="absolute rounded-full blur-3xl"
              style={{
                width: 280,
                height: 280,
                left: '10%',
                bottom: '15%',
                background: isDarkTheme ? `${accentColor}40` : `${primaryColor}30`,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: isDarkTheme ? [0.3, 0.5, 0.3] : [0.25, 0.45, 0.25],
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{ duration: 14, repeat: Infinity, repeatType: 'reverse', delay: 3 }}
            />
          </>
        )}

        {variant === 'processing' && (
          <motion.div
            key="processing-orb"
            className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-[100px]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.3, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        )}

        {variant === 'result' && result && (
          <motion.div
            key="result-orb"
            className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            style={{
              backgroundColor: config.colors[0],
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default memo(UnifiedBackground);
