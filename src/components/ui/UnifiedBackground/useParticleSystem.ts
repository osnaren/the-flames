/**
 * Particle System Hook
 * Handles particle creation, animation, and rendering
 */

'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { ParticleShape, SeasonalTheme, THEME_EMOJIS } from '@/themes/seasonal/types';
import { colorToRgbaPrefix } from '@/utils/colorUtils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { drawParticleShape } from './shapes';
import { Particle, ParticleSystemConfig } from './types';

// --- Helper: Get Theme Colors for Canvas ---

function getThemeColors(isDark: boolean): string[] {
  if (typeof window === 'undefined') return [];

  const computedStyle = getComputedStyle(document.documentElement);

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

  // Fallback colors
  if (colors.length === 0) {
    const opacity = isDark ? 0.85 : 0.75;
    return [`rgba(249, 115, 22, ${opacity})`, `rgba(139, 92, 246, ${opacity})`, `rgba(6, 182, 212, ${opacity})`];
  }

  return colors;
}

// --- Input yielding ---
// The particle layer is pure decoration. For a short window after any tap,
// click or keypress it skips drawing, so the frame that shows the response to
// the user's input never also pays for a canvas redraw (keeps INP low).
const INPUT_QUIET_MS = 350;
let lastInputAt = -Infinity;
if (typeof window !== 'undefined') {
  const markInput = () => {
    lastInputAt = performance.now();
  };
  window.addEventListener('pointerdown', markInput, { capture: true, passive: true });
  window.addEventListener('keydown', markInput, { capture: true, passive: true });
}

// --- Result Color Maps ---

const RESULT_COLORS: Record<string, string[]> = {
  F: ['rgba(255, 215, 0, 0.8)', 'rgba(255, 165, 0, 0.7)'],
  L: ['rgba(236, 72, 153, 0.8)', 'rgba(244, 114, 182, 0.7)'],
  A: ['rgba(168, 85, 247, 0.8)', 'rgba(192, 132, 252, 0.7)'],
  M: ['rgba(16, 185, 129, 0.8)', 'rgba(52, 211, 153, 0.7)'],
  E: ['rgba(239, 68, 68, 0.8)', 'rgba(248, 113, 113, 0.7)'],
  S: ['rgba(59, 130, 246, 0.8)', 'rgba(96, 165, 250, 0.7)'],
};

const RESULT_SHAPES: Record<string, ParticleShape[]> = {
  F: ['star', 'circle'],
  L: ['heart'],
  A: ['heart', 'circle'],
  M: ['circle', 'star'],
  E: ['flame', 'circle'],
  S: ['circle'],
};

// --- Hook Types ---

interface UseParticleSystemProps {
  enabled: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  themeParticleConfig: {
    enabled: boolean;
    count: number;
    colors: string[];
    shapes: ParticleShape[];
    size: { min: number; max: number };
    speed: { min: number; max: number };
    opacity: { min: number; max: number };
    direction: 'down' | 'up' | 'random' | 'swirl';
    animation: 'float' | 'fall' | 'sparkle' | 'pulse';
  };
  variant: 'default' | 'processing' | 'result';
  result: string | null | undefined;
  intensity: 'low' | 'medium' | 'high';
  currentTheme: SeasonalTheme;
}

interface UseParticleSystemReturn {
  config: ParticleSystemConfig;
  canvasColors: string[];
}

// --- Main Hook ---

export function useParticleSystem({
  enabled,
  canvasRef,
  themeParticleConfig,
  variant,
  result,
  intensity,
  currentTheme,
}: UseParticleSystemProps): UseParticleSystemReturn {
  const { shouldAnimate } = useAnimationPreferences();
  const { isMobile, isLowPowerMode } = useDeviceCapabilities();
  const isDarkTheme = usePreferencesStore((state) => state.isDarkTheme);

  const animationIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef<number>(0);
  const pixelRatioRef = useRef(1);

  // Frame rate control
  const targetFPS = isLowPowerMode ? 15 : isMobile ? 24 : 30;
  const frameInterval = 1000 / targetFPS;

  // --- Dynamic Colors State ---
  const [canvasColors, setCanvasColors] = useState<string[]>([]);

  // Update canvas colors when theme changes. Seasonal themes keep their own
  // festival palette; only the classic theme reads the app palette, and that
  // style read waits for idle time so it never lands inside a tap.
  useEffect(() => {
    if (!enabled || !shouldAnimate) return;
    const useAppPalette = variant === 'default' && currentTheme === 'default';
    if (!useAppPalette) {
      setCanvasColors(themeParticleConfig.colors);
      return;
    }
    const apply = () => {
      const colors = getThemeColors(isDarkTheme);
      setCanvasColors(colors.length > 0 ? colors : themeParticleConfig.colors);
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(apply, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(apply, 200);
    return () => clearTimeout(timer);
  }, [enabled, shouldAnimate, isDarkTheme, variant, themeParticleConfig, currentTheme]);

  // --- Configuration ---
  const config = useMemo((): ParticleSystemConfig => {
    let intensityMultiplier = intensity === 'high' ? 1.5 : intensity === 'low' ? 0.5 : 1;

    // Performance scaling
    if (isMobile) intensityMultiplier *= 0.4;
    if (isLowPowerMode) intensityMultiplier *= 0.5;

    // Size scaling for different devices
    const sizeScale = isMobile ? 0.6 : isLowPowerMode ? 0.8 : 1;
    const scaledSize = {
      min: Math.max(1, Math.round(themeParticleConfig.size.min * sizeScale)),
      max: Math.max(2, Math.round(themeParticleConfig.size.max * sizeScale)),
    };

    // Speed scaling - slightly faster on mobile for more dynamic feel with fewer particles
    const speedScale = isMobile ? 1.2 : 1;
    const scaledSpeed = {
      min: themeParticleConfig.speed.min * speedScale,
      max: themeParticleConfig.speed.max * speedScale,
    };

    // Base config from seasonal theme
    let particleConfig: ParticleSystemConfig = {
      enabled: themeParticleConfig.enabled,
      count: Math.floor(themeParticleConfig.count * intensityMultiplier),
      colors: canvasColors.length > 0 ? canvasColors : themeParticleConfig.colors,
      shapes: themeParticleConfig.shapes,
      size: scaledSize,
      speed: scaledSpeed,
      direction: themeParticleConfig.direction,
      opacity: themeParticleConfig.opacity,
      animation: themeParticleConfig.animation,
    };

    // Overrides based on Variant
    if (variant === 'processing') {
      const processingSize = isMobile ? { min: 1, max: 3 } : { min: 2, max: 6 };
      particleConfig = {
        enabled: true,
        count: Math.floor(50 * intensityMultiplier),
        colors: ['rgba(249, 115, 22, 0.8)', 'rgba(234, 88, 12, 0.7)', 'rgba(254, 215, 170, 0.6)'],
        shapes: ['flame', 'circle'] as ParticleShape[],
        size: processingSize,
        speed: { min: 2, max: 5 },
        direction: 'up',
        opacity: { min: 0.4, max: 0.8 },
        animation: 'sparkle',
      };
    } else if (variant === 'result' && result) {
      const resultSize = isMobile ? { min: 2, max: 5 } : { min: 3, max: 8 };
      particleConfig = {
        enabled: true,
        count: Math.floor(60 * intensityMultiplier),
        colors: RESULT_COLORS[result] || ['rgba(255, 255, 255, 0.8)'],
        shapes: RESULT_SHAPES[result] || ['circle'],
        size: resultSize,
        speed: { min: 1, max: 3 },
        direction: 'up',
        opacity: { min: 0.5, max: 0.9 },
        animation: 'sparkle',
      };
    }

    return particleConfig;
  }, [variant, result, intensity, themeParticleConfig, isMobile, isLowPowerMode, canvasColors]);

  // Re-seed particles only when their structure changes. Colour changes (light /
  // dark toggles, palette reads) recolour the existing particles in place so a
  // theme switch never restarts the system on the main thread.
  const structuralKey = `${config.enabled}|${config.count}|${config.shapes.join(',')}|${config.size.min}-${config.size.max}|${config.speed.min}-${config.speed.max}|${config.direction}|${config.animation}|${config.opacity.min}-${config.opacity.max}`;
  const configRef = useRef(config);
  const isDarkRef = useRef(isDarkTheme);
  useEffect(() => {
    configRef.current = config;
    const colors = config.colors;
    if (colors.length === 0) return;
    particlesRef.current.forEach((particle, index) => {
      particle.color = colors[index % colors.length];
    });
  }, [config]);
  useEffect(() => {
    isDarkRef.current = isDarkTheme;
  }, [isDarkTheme]);

  // Get emojis for current theme
  const themeEmojis = useMemo(() => {
    return THEME_EMOJIS[currentTheme] || THEME_EMOJIS.default;
  }, [currentTheme]);

  // --- Particle Creation ---
  const createParticle = useCallback(
    (width: number, height: number, cfg: ParticleSystemConfig): Particle => {
      const direction = cfg.direction;
      let speedY = Math.random() * (cfg.speed.max - cfg.speed.min) + cfg.speed.min;

      if (direction === 'up') speedY = -speedY;
      else if (direction === 'down') speedY = Math.abs(speedY);
      else if (direction === 'random') speedY = (Math.random() - 0.5) * cfg.speed.max * 2;

      const selectedShape = cfg.shapes[Math.floor(Math.random() * cfg.shapes.length)];

      // Assign emoji if shape is 'emoji' or randomly for variety
      let emoji: string | undefined;
      if (selectedShape === 'emoji' || (themeEmojis.length > 0 && Math.random() < 0.3)) {
        emoji = themeEmojis[Math.floor(Math.random() * themeEmojis.length)];
      }

      return {
        id: Math.random(),
        x: Math.random() * width,
        y: direction === 'up' ? height + 20 : direction === 'down' ? -20 : Math.random() * height,
        size: Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min,
        speedX: direction === 'swirl' ? (Math.random() - 0.5) * cfg.speed.max : (Math.random() - 0.5) * 0.5,
        speedY,
        opacity: Math.random() * (cfg.opacity.max - cfg.opacity.min) + cfg.opacity.min,
        shape: emoji ? 'emoji' : selectedShape,
        color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 1,
        emoji,
      };
    },
    [themeEmojis]
  );

  // --- Initialize Particles ---
  const initParticles = useCallback(() => {
    const config = configRef.current;
    if (!enabled || !config.enabled || !shouldAnimate) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width / pixelRatioRef.current : window.innerWidth;
    const height = canvas ? canvas.height / pixelRatioRef.current : window.innerHeight;

    const newParticles: Particle[] = [];
    for (let i = 0; i < config.count; i++) {
      const p = createParticle(width, height, config);
      p.y = Math.random() * height;
      newParticles.push(p);
    }
    particlesRef.current = newParticles;
    // structuralKey stands in for the parts of `config` that need a re-seed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, structuralKey, shouldAnimate, createParticle, canvasRef]);

  // Re-init particles when config changes
  useEffect(() => {
    initParticles();
  }, [initParticles]);

  // --- Animation Loop ---
  useEffect(() => {
    if (!enabled || !shouldAnimate || !configRef.current.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      if (!isVisibleRef.current) {
        return;
      }

      if (timestamp - lastFrameTimeRef.current < frameInterval || timestamp - lastInputAt < INPUT_QUIET_MS) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const dpr = pixelRatioRef.current;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      const config = configRef.current;
      const opacityBoost = isDarkRef.current ? 1.2 : 1.5;

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

        // Enhanced visibility
        ctx.globalAlpha = Math.min(p.opacity * opacityBoost, 1);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        // Draw the shape
        drawParticleShape(ctx, p.shape, p.size, p.emoji);

        ctx.restore();
      });

      ctx.restore();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Resize Handler
    let lastWidth = 0;
    let lastHeight = 0;
    const handleResize = () => {
      // Mobile browsers resize the viewport when the URL bar shows or hides
      // while scrolling. Keep the particles in place unless the layout really
      // changed (rotation, desktop window resize).
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width === lastWidth && Math.abs(height - lastHeight) < 160) return;
      const reseed = width !== lastWidth || lastWidth === 0;
      lastWidth = width;
      lastHeight = height;

      // Keep CSS and backing-store coordinates consistent at a bounded DPR.
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
      pixelRatioRef.current = dpr;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      if (reseed) initParticles();
      lastFrameTimeRef.current = 0;
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      cancelAnimationFrame(animationIdRef.current);
      if (isVisibleRef.current) {
        lastFrameTimeRef.current = 0;
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    isVisibleRef.current = !document.hidden;

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [enabled, shouldAnimate, frameInterval, canvasRef, initParticles, isMobile]);

  return { config, canvasColors };
}
