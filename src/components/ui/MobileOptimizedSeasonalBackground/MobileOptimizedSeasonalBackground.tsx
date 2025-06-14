import { useCallback, useEffect, useMemo, useRef } from 'react';
// import { useSeasonalTheme } from '../../../themes/seasonal/useSeasonalTheme';
import { useDeviceCapabilities } from '../../../hooks/useDeviceCapabilities';
// import { usePerformanceMonitor } from '../../../hooks/usePerformanceMonitor';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  color: string;
  shape: string;
}

interface MobileOptimizedSeasonalBackgroundProps {
  className?: string;
  interactive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function MobileOptimizedSeasonalBackground({
  className = '',
  interactive = true,
  intensity = 'medium',
}: MobileOptimizedSeasonalBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const deviceCapabilities = useDeviceCapabilities();

  // Calculate optimized settings based on device capabilities
  const optimizedSettings = useMemo(() => {
    const baseIntensity = intensity === 'low' ? 0.3 : intensity === 'medium' ? 0.6 : 1.0;
    let multiplier = 1.0;

    // Adjust based on device capabilities
    if (deviceCapabilities.isMobile) multiplier *= 0.6;
    if (deviceCapabilities.deviceMemory < 2) multiplier *= 0.4;
    if (deviceCapabilities.networkSpeed === 'slow') multiplier *= 0.5;
    if (deviceCapabilities.isLowPowerMode) multiplier *= 0.3;
    if (deviceCapabilities.reducedMotion) multiplier *= 0.2;

    const finalIntensity = baseIntensity * multiplier;

    return {
      maxParticles: Math.floor(100 * finalIntensity),
      spawnRate: Math.max(1, Math.floor(5 * finalIntensity)),
      animationSpeed: deviceCapabilities.reducedMotion ? 0.1 : 1.0,
      enableInteraction: interactive && deviceCapabilities.hasTouch && !deviceCapabilities.isLowPowerMode,
      particleSize: deviceCapabilities.isMobile ? 0.8 : 1.0,
    };
  }, [intensity, deviceCapabilities, interactive]);

  // Particle creation function
  const createParticle = useCallback(
    (x?: number, y?: number): Particle => {
      const canvas = canvasRef.current;
      if (!canvas) return {} as Particle;

      const { width, height } = canvas;

      return {
        x: x ?? Math.random() * width,
        y: y ?? height + 10,
        vx: (Math.random() - 0.5) * 2 * optimizedSettings.animationSpeed,
        vy: -Math.random() * 3 * optimizedSettings.animationSpeed,
        size: (Math.random() * 10 + 5) * optimizedSettings.particleSize,
        opacity: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02 * optimizedSettings.animationSpeed,
        life: 3000 + Math.random() * 2000,
        maxLife: 3000 + Math.random() * 2000,
        color: '#60A5FA',
        shape: 'circle',
      };
    },
    [optimizedSettings]
  );

  // Touch interaction handler
  const handleTouch = useCallback(
    (event: TouchEvent) => {
      if (!optimizedSettings.enableInteraction) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];

      if (touch) {
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        touchRef.current = { x, y };

        // Create particles at touch location
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(createParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20));
        }
      }
    },
    [optimizedSettings, createParticle]
  );

  // Update particles
  const updateParticles = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width, height } = canvas;
      const particles = particlesRef.current;

      // Update existing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.rotation += particle.rotationSpeed * deltaTime;
        particle.life -= deltaTime;

        // Remove dead or off-screen particles
        if (particle.life <= 0 || particle.y < -50 || particle.x < -50 || particle.x > width + 50) {
          particles.splice(i, 1);
        }
      }

      // Spawn new particles
      if (particles.length < optimizedSettings.maxParticles) {
        for (let i = 0; i < optimizedSettings.spawnRate; i++) {
          if (particles.length >= optimizedSettings.maxParticles) break;
          particles.push(createParticle());
        }
      }
    },
    [optimizedSettings, createParticle]
  );

  // Render particles
  const renderParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;

    particles.forEach((particle) => {
      ctx.save();

      // Set opacity based on life remaining
      const lifeRatio = particle.life / particle.maxLife;
      ctx.globalAlpha = particle.opacity * lifeRatio;

      // Set color and render
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback(
    (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      updateParticles(deltaTime);
      renderParticles(ctx);

      animationRef.current = requestAnimationFrame(animate);
    },
    [updateParticles, renderParticles]
  );

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, deviceCapabilities.isMobile ? 2 : 3);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Add touch event listeners
    if (optimizedSettings.enableInteraction) {
      canvas.addEventListener('touchstart', handleTouch, { passive: true });
      canvas.addEventListener('touchmove', handleTouch, { passive: true });
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);

      if (optimizedSettings.enableInteraction) {
        canvas.removeEventListener('touchstart', handleTouch);
        canvas.removeEventListener('touchmove', handleTouch);
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, handleTouch, optimizedSettings, deviceCapabilities]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
      aria-hidden="true"
    />
  );
}
