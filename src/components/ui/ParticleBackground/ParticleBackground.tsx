import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import type { Container, ISourceOptions } from '@tsparticles/engine';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ParticleBackgroundProps {
  color?: string;
  particleCount?: number;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A reusable particle background effect component
 * Uses tsparticles for high-performance particle animations
 */
export function ParticleBackground({
  color = 'var(--color-primary)',
  particleCount = 10,
  enabled = true,
  className = '',
  style = {},
}: ParticleBackgroundProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const showParticles = useMemo(() => enabled && shouldAnimate, [enabled, shouldAnimate]);
  const [init, setInit] = useState(false);

  // Initialize the particle engine once per application lifetime
  useEffect(() => {
    // Initialize the engine once on component mount
    initParticlesEngine(async (_engine) => {
      // You can load specific presets or plugins here if needed, e.g.:
      // await loadFull(engine); // Loads all features
      // Or, load individual features if your options require them and they aren't auto-loaded.
      // For the current options (circle shape, basic movement, opacity, size),
      // explicit loading beyond initParticlesEngine might not be necessary with @tsparticles/react.
    }).then(() => {
      setInit(true);
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  const particlesLoaded = useCallback(async (_container?: Container): Promise<void> => {
    // Optional container parameter to match expected signature
    // You can add custom initialization logic here if needed
  }, []);

  // Particle configuration with theme-consistent styling
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        color: {
          value: color,
        },
        number: {
          value: particleCount,
          density: {
            enable: true,
            area: 800,
          },
        },
        opacity: {
          value: { min: 0.2, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
            minimumValue: 0.1,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        links: {
          enable: false,
        },
        shape: {
          type: 'circle',
        },
        detectRetina: true,
      },
    }),
    [color, particleCount]
  );

  // Don't render anything if animations are disabled or not initialized
  if (!showParticles || !init) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true" style={style}>
      <Particles
        id="tsparticles-background"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  );
}

export default ParticleBackground;
