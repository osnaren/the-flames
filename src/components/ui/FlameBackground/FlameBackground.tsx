'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { colorToRgbaPrefix } from '@utils/colorUtils';
import { motion } from 'framer-motion';
import { memo, useCallback, useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;

  constructor(canvasWidth: number, canvasHeight: number, colors: string[]) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight + 10;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = -Math.random() * 3 - 1;

    // Use dynamically fetched and converted theme colors
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.5; // Keep increased opacity
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > 0.2) this.size -= 0.05;
    this.opacity -= 0.008;
  }

  draw(ctx: CanvasRenderingContext2D, defaultColor: string) {
    // Ensure color string ends correctly
    const colorPrefix = this.color.endsWith(', ') ? this.color : defaultColor; // Use first available prefix as fallback
    ctx.fillStyle = colorPrefix + this.opacity + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function FlameBackground() {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef<string[]>([]);
  const isVisibleRef = useRef(true);

  // Handle visibility change to pause animation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Memoized animation loop for better performance
  const animate = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Skip frame if page is not visible
    if (!isVisibleRef.current) {
      // eslint-disable-next-line react-hooks/immutability
      animationIdRef.current = requestAnimationFrame(() => animate(ctx, canvas));
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create particles less frequently for better performance
    if (Math.random() > 0.92) {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(new Particle(canvas.width, canvas.height, colorsRef.current));
      }
    }

    // Limit max particles for performance
    const maxParticles = 100;
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current = particlesRef.current.slice(-maxParticles);
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      particlesRef.current[i].update();
      particlesRef.current[i].draw(ctx, colorsRef.current[0]);

      if (particlesRef.current[i].size <= 0.2 || particlesRef.current[i].opacity <= 0) {
        particlesRef.current.splice(i, 1);
      }
    }

    animationIdRef.current = requestAnimationFrame(() => animate(ctx, canvas));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!shouldAnimate || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get computed theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryContainer = computedStyle.getPropertyValue('--md-color-primary-container');
    const secondaryContainer = computedStyle.getPropertyValue('--md-color-secondary-container');
    const tertiaryContainer = computedStyle.getPropertyValue('--md-color-tertiary-container');
    const primary = computedStyle.getPropertyValue('--md-color-primary');

    // Convert theme colors to RGBA prefixes for canvas
    const particleColorPrefixes = [
      colorToRgbaPrefix(primaryContainer),
      colorToRgbaPrefix(secondaryContainer),
      colorToRgbaPrefix(tertiaryContainer),
      colorToRgbaPrefix(primary),
    ].filter((prefix) => prefix !== 'rgba(0, 0, 0, ');

    if (particleColorPrefixes.length === 0) {
      particleColorPrefixes.push('rgba(249, 115, 22, ');
    }

    colorsRef.current = particleColorPrefixes;

    // Use ResizeObserver for more efficient resize handling
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resizeObserver.observe(document.documentElement);

    animate(ctx, canvas);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      resizeObserver.disconnect();
      particlesRef.current = [];
    };
  }, [shouldAnimate, animate]);

  // Static background for reduced motion or no animation
  if (!shouldAnimate || prefersReducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-5"></div>
        <div className="bg-primary-container/20 absolute top-1/4 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full blur-3xl"></div>
        <div className="bg-tertiary-container/20 absolute right-0 bottom-0 h-120 w-120 rounded-full blur-3xl"></div>
        <div className="bg-secondary-container/20 absolute top-0 left-0 h-80 w-[20rem] rounded-full blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-5"></div>

      <motion.div
        className="bg-tertiary-container/20 absolute top-1/4 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="bg-secondary-container/30 absolute right-0 bottom-0 h-120 w-120 rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="bg-primary-container/40 absolute top-0 left-0 h-80 w-[20rem] rounded-full blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(FlameBackground);
