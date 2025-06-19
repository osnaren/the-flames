import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  shape: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface SeasonalBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function SeasonalBackground({ intensity = 'medium', className = '' }: SeasonalBackgroundProps) {
  const { currentThemeConfig } = useSeasonalTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  const intensityMultiplier = {
    low: 0.5,
    medium: 1,
    high: 1.5,
  }[intensity];

  const config = currentThemeConfig.backgroundEffects;

  // Generate particles
  const particles = useMemo(() => {
    if (!config.particleEffects.enabled || !shouldAnimate) return [];

    const count = Math.floor(config.particleEffects.count * intensityMultiplier);
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        size:
          Math.random() * (config.particleEffects.size.max - config.particleEffects.size.min) +
          config.particleEffects.size.min,
        speed:
          Math.random() * (config.particleEffects.speed.max - config.particleEffects.speed.min) +
          config.particleEffects.speed.min,
        opacity:
          Math.random() * (config.particleEffects.opacity.max - config.particleEffects.opacity.min) +
          config.particleEffects.opacity.min,
        shape: config.particleEffects.shapes[Math.floor(Math.random() * config.particleEffects.shapes.length)],
        color: config.particleEffects.colors[Math.floor(Math.random() * config.particleEffects.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }

    return newParticles;
  }, [config, intensityMultiplier, shouldAnimate]);

  // Initialize particles
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  // Animation loop
  useEffect(() => {
    if (!shouldAnimate || !config.particleEffects.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position based on direction
        switch (config.particleEffects.direction) {
          case 'down':
            particle.y += particle.speed;
            if (particle.y > canvas.height + particle.size) {
              particle.y = -particle.size;
              particle.x = Math.random() * canvas.width;
            }
            break;
          case 'up':
            particle.y -= particle.speed;
            if (particle.y < -particle.size) {
              particle.y = canvas.height + particle.size;
              particle.x = Math.random() * canvas.width;
            }
            break;
          case 'swirl':
            particle.rotation += particle.rotationSpeed;
            particle.x += Math.cos(particle.rotation * 0.1) * particle.speed * 0.5;
            particle.y += Math.sin(particle.rotation * 0.1) * particle.speed * 0.5;
            break;
          case 'random':
          default:
            particle.x += (Math.random() - 0.5) * particle.speed;
            particle.y += (Math.random() - 0.5) * particle.speed;
            break;
        }

        // Wrap around screen
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        // Update rotation
        particle.rotation += particle.rotationSpeed;

        // Update opacity for sparkle animation
        if (config.particleEffects.animation === 'sparkle') {
          particle.opacity = Math.abs(Math.sin(Date.now() * 0.001 + particle.id)) * 0.8 + 0.2;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;

        drawParticle(ctx, particle);

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    updateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, shouldAnimate]);

  // Draw individual particle based on shape
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.strokeStyle = particle.color;

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'heart':
        drawHeart(ctx, particle.size);
        break;

      case 'star':
        drawStar(ctx, particle.size, 5);
        break;

      case 'snowflake':
        drawSnowflake(ctx, particle.size);
        break;

      case 'pumpkin':
        drawPumpkin(ctx, particle.size);
        break;

      case 'bat':
        drawBat(ctx, particle.size);
        break;

      default:
        // Default to circle
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  };

  // Shape drawing functions
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
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawSnowflake = (ctx: CanvasRenderingContext2D, size: number) => {
    const radius = size / 2;
    ctx.lineWidth = 1;

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Add small branches
      const branchLength = radius * 0.3;
      const branchAngle1 = angle + Math.PI / 6;
      const branchAngle2 = angle - Math.PI / 6;

      ctx.beginPath();
      ctx.moveTo(x * 0.7, y * 0.7);
      ctx.lineTo(x * 0.7 + Math.cos(branchAngle1) * branchLength, y * 0.7 + Math.sin(branchAngle1) * branchLength);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x * 0.7, y * 0.7);
      ctx.lineTo(x * 0.7 + Math.cos(branchAngle2) * branchLength, y * 0.7 + Math.sin(branchAngle2) * branchLength);
      ctx.stroke();
    }
  };

  const drawPumpkin = (ctx: CanvasRenderingContext2D, size: number) => {
    const width = size;
    const height = size;

    // Pumpkin body
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vertical lines
    ctx.strokeStyle = ctx.fillStyle;
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

    // Bat body
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

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Background Gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: config.gradientAnimation
            ? currentThemeConfig.colors.backgroundGradient[0]
            : currentThemeConfig.colors.background,
        }}
        animate={
          config.gradientAnimation
            ? {
                background: currentThemeConfig.colors.backgroundGradient,
              }
            : {}
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />

      {/* Pattern Overlay */}
      {config.overlayPattern && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${config.overlayPattern})`,
            backgroundRepeat: 'repeat',
            opacity: config.overlayOpacity || 0.1,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {/* Particle Canvas */}
      {shouldAnimate && config.particleEffects.enabled && (
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0.8 }} />
      )}

      {/* Glow Effects */}
      {config.glowEffects && (
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 20% 20%, ${currentThemeConfig.colors.primary}40 0%, transparent 50%), 
                          radial-gradient(circle at 80% 80%, ${currentThemeConfig.colors.secondary}40 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, ${currentThemeConfig.colors.accent}40 0%, transparent 50%)`,
              filter: 'blur(40px)',
            }}
          />
        </div>
      )}

      {/* Pulsing Effect */}
      {config.pulsing && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${currentThemeConfig.colors.primary}10 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}
