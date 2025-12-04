import { useAnimationPreferences } from '@/hooks/useAnimationPreferences'; // Import hook
import { colorToRgbaPrefix } from '@utils/colorUtils'; // Import the function
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

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

export default function FlameBackground() {
  const { shouldAnimate } = useAnimationPreferences(); // Use hook
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    ].filter((prefix) => prefix !== 'rgba(0, 0, 0, '); // Filter out fallback color if parsing failed

    // Handle case where all color parsing fails
    if (particleColorPrefixes.length === 0) {
      particleColorPrefixes.push('rgba(249, 115, 22, '); // Add a default fallback color prefix
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];

    const createParticles = () => {
      if (Math.random() > 0.9) {
        for (let i = 0; i < 4; i++) {
          particles.push(new Particle(canvas.width, canvas.height, particleColorPrefixes));
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx, particleColorPrefixes[0]);

        if (particles[i].size <= 0.2 || particles[i].opacity <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      createParticles();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [shouldAnimate]);

  if (!shouldAnimate) {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="bg-primary-container/20 absolute top-1/4 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full blur-3xl"></div>
        <div className="bg-tertiary-container/20 absolute right-0 bottom-0 h-120 w-120 rounded-full blur-3xl"></div>
        <div className="bg-secondary-container/20 absolute top-0 left-0 h-80 w-[20rem] rounded-full blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

      <motion.div
        className="bg-tertiary-container/20 absolute top-1/4 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full blur-3xl"
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
        className="bg-secondary-container/30 absolute right-0 bottom-0 h-120 w-120 rounded-full blur-3xl"
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
        className="bg-primary-container/40 absolute top-0 left-0 h-80 w-[20rem] rounded-full blur-3xl"
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
