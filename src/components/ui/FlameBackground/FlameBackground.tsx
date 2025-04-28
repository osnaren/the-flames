import { usePreferences } from '@hooks/usePreferences';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function FlameBackground() {
  const [{ animationsEnabled }] = usePreferences();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Should we enable animations based on both user settings and system preferences
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;

  // Particle animation effect
  useEffect(() => {
    if (!shouldAnimate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = -Math.random() * 3 - 1;

        // Ember colors - using theme-aligned values
        const colors = [
          'rgba(249, 115, 22, ', // Primary container
          'rgba(253, 191, 36, ', // Secondary container
          'rgba(255, 182, 144, ', // Primary in dark mode
          'rgba(255, 223, 159, ', // Secondary in dark mode
        ];

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.05;
        this.opacity -= 0.005;
      }

      draw() {
        ctx!.fillStyle = this.color + this.opacity + ')';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const particles: Particle[] = [];

    const createParticles = () => {
      // Only create particles occasionally
      if (Math.random() > 0.92) {
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle());
        }
      }

      // Remove particles that are too small or transparent
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].size <= 0.2 || particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
    };

    let animationId: number;

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      createParticles();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [shouldAnimate]);

  // Enhanced static background for reduced motion or animations disabled
  if (!shouldAnimate) {
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Texture overlay with noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

        {/* Static light effects using theme variables */}
        <div className="bg-primary-container/15 absolute top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"></div>
        <div className="bg-tertiary-container/15 absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl"></div>
        <div className="bg-secondary-container/15 absolute top-0 left-0 h-[20rem] w-[20rem] rounded-full blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Texture overlay with noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

      {/* Radial light effects using theme variables */}
      <motion.div
        className="bg-primary-container/15 absolute top-1/4 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <motion.div
        className="bg-tertiary-container/15 absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <motion.div
        className="bg-secondary-container/15 absolute top-0 left-0 h-[20rem] w-[20rem] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Particle canvas for embers */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
