import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultData } from '@features/flamesGame/resultData';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

interface DynamicBackgroundProps {
  variant: 'default' | 'processing' | 'result';
  result?: FlamesResult;
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'valentine' | 'halloween' | 'christmas';
  intensity?: 'low' | 'medium' | 'high';
}

interface BackgroundConfig {
  gradients: string[];
  particles: {
    count: number;
    colors: string[];
    shapes: ('circle' | 'heart' | 'star' | 'flame')[];
  };
  orbs: {
    count: number;
    colors: string[];
    sizes: number[];
  };
  effects: {
    glow: boolean;
    sparkles: boolean;
    floating: boolean;
  };
}

/**
 * Dynamic background system that adapts to game state, results, and seasons
 * Highly configurable and scalable for future enhancements
 */
function DynamicBackground({ variant = 'default', result, season, intensity = 'medium' }: DynamicBackgroundProps) {
  const { shouldAnimate } = useAnimationPreferences();

  // Get result-specific styling
  const resultData = result ? getResultData(result) : null;

  // Generate background configuration based on props
  const backgroundConfig = useMemo((): BackgroundConfig => {
    const baseConfig: BackgroundConfig = {
      gradients: [],
      particles: { count: 0, colors: [], shapes: ['circle'] },
      orbs: { count: 0, colors: [], sizes: [] },
      effects: { glow: false, sparkles: false, floating: false },
    };

    // Intensity multipliers
    const intensityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.5,
    }[intensity];

    // Base configuration by variant
    switch (variant) {
      case 'default':
        baseConfig.gradients = [
          'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%)',
          'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2), transparent 50%)',
          'radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2), transparent 50%)',
        ];
        baseConfig.particles = {
          count: Math.floor(8 * intensityMultiplier),
          colors: ['rgba(120, 119, 198, 0.6)', 'rgba(255, 119, 198, 0.5)', 'rgba(120, 219, 255, 0.5)'],
          shapes: ['circle'],
        };
        baseConfig.orbs = {
          count: 3,
          colors: ['rgba(120, 119, 198, 0.15)', 'rgba(255, 119, 198, 0.1)', 'rgba(120, 219, 255, 0.1)'],
          sizes: [200, 150, 100],
        };
        baseConfig.effects = { glow: true, sparkles: true, floating: true };
        break;

      case 'processing':
        baseConfig.gradients = [
          'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.4), transparent 60%)',
          'radial-gradient(circle at 30% 70%, rgba(249, 115, 22, 0.3), transparent 50%)',
        ];
        baseConfig.particles = {
          count: Math.floor(12 * intensityMultiplier),
          colors: ['rgba(147, 51, 234, 0.7)', 'rgba(249, 115, 22, 0.6)'],
          shapes: ['circle', 'flame'],
        };
        baseConfig.orbs = {
          count: 2,
          colors: ['rgba(147, 51, 234, 0.2)', 'rgba(249, 115, 22, 0.15)'],
          sizes: [300, 200],
        };
        baseConfig.effects = { glow: true, sparkles: true, floating: true };
        break;

      case 'result':
        if (resultData) {
          const resultColor = resultData.glowColor;
          baseConfig.gradients = [
            `radial-gradient(circle at 50% 50%, ${resultColor}40, transparent 70%)`,
            `radial-gradient(circle at 20% 80%, ${resultColor}20, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, ${resultColor}30, transparent 60%)`,
          ];
          baseConfig.particles = {
            count: Math.floor(15 * intensityMultiplier),
            colors: [resultColor + 'AA', resultColor + '88'],
            shapes: result === 'L' ? ['heart'] : result === 'F' ? ['star'] : ['circle'],
          };
          baseConfig.orbs = {
            count: 4,
            colors: [resultColor + '30', resultColor + '20', resultColor + '15'],
            sizes: [250, 180, 120, 80],
          };
          baseConfig.effects = { glow: true, sparkles: true, floating: true };
        }
        break;
    }

    // Season-specific modifications
    if (season) {
      switch (season) {
        case 'valentine':
          baseConfig.particles.shapes = ['heart'];
          baseConfig.particles.colors = ['rgba(255, 20, 147, 0.8)', 'rgba(255, 105, 180, 0.7)'];
          baseConfig.gradients.push('radial-gradient(circle at 60% 40%, rgba(255, 20, 147, 0.2), transparent 50%)');
          break;

        case 'christmas':
          baseConfig.particles.colors = ['rgba(220, 20, 60, 0.8)', 'rgba(34, 139, 34, 0.7)', 'rgba(255, 215, 0, 0.6)'];
          baseConfig.particles.shapes = ['star'];
          break;

        case 'halloween':
          baseConfig.particles.colors = ['rgba(255, 140, 0, 0.8)', 'rgba(128, 0, 128, 0.7)'];
          baseConfig.gradients = [
            'radial-gradient(circle at 30% 70%, rgba(255, 140, 0, 0.3), transparent 50%)',
            'radial-gradient(circle at 70% 30%, rgba(128, 0, 128, 0.2), transparent 50%)',
          ];
          break;
      }
    }

    return baseConfig;
  }, [variant, result, resultData, season, intensity]);

  // Don't render if animations are disabled and it's not a result background
  if (!shouldAnimate && variant !== 'result') {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient layers */}
      {backgroundConfig.gradients.map((gradient, index) => (
        <motion.div
          key={`gradient-${index}`}
          className="absolute inset-0"
          style={{ background: gradient }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: shouldAnimate ? [0.3, 0.6, 0.3] : 0.4,
            scale: shouldAnimate ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: shouldAnimate ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        />
      ))}

      {/* Floating orbs */}
      {backgroundConfig.orbs.colors.map((color, index) => (
        <motion.div
          key={`orb-${index}`}
          className="absolute rounded-full blur-3xl"
          style={{
            background: color,
            width: backgroundConfig.orbs.sizes[index] || 150,
            height: backgroundConfig.orbs.sizes[index] || 150,
            left: `${20 + ((index * 25) % 60)}%`,
            top: `${15 + ((index * 30) % 70)}%`,
          }}
          animate={
            shouldAnimate
              ? {
                  x: [0, 30, -20, 0],
                  y: [0, -20, 30, 0],
                  scale: [1, 1.2, 0.8, 1],
                  opacity: [0.3, 0.6, 0.4, 0.3],
                }
              : {}
          }
          transition={{
            duration: 12 + index * 2,
            repeat: shouldAnimate ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: index * 1.5,
          }}
        />
      ))}

      {/* Animated particles */}
      {shouldAnimate && backgroundConfig.effects.floating && (
        <>
          {Array.from({ length: backgroundConfig.particles.count }).map((_, index) => {
            const color = backgroundConfig.particles.colors[index % backgroundConfig.particles.colors.length];
            const shape = backgroundConfig.particles.shapes[index % backgroundConfig.particles.shapes.length];

            return (
              <motion.div
                key={`particle-${index}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5,
                  ease: 'easeOut',
                }}
              >
                <ParticleShape shape={shape} color={color} />
              </motion.div>
            );
          })}
        </>
      )}

      {/* Sparkle effects */}
      {shouldAnimate && backgroundConfig.effects.sparkles && (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={`sparkle-${index}`}
              className="absolute text-2xl"
              style={{
                left: `${20 + ((index * 15) % 80)}%`,
                top: `${10 + ((index * 20) % 80)}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2 + index * 0.5,
                ease: 'easeInOut',
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// Particle shape component
function ParticleShape({ shape, color }: { shape: string; color: string }) {
  const baseStyle = {
    color,
    filter: `drop-shadow(0 0 6px ${color})`,
  };

  switch (shape) {
    case 'heart':
      return <div style={baseStyle}>💖</div>;
    case 'star':
      return <div style={baseStyle}>⭐</div>;
    case 'flame':
      return <div style={baseStyle}>🔥</div>;
    default:
      return <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />;
  }
}

export default memo(DynamicBackground);
