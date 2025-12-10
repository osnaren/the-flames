/**
 * Background Effects Components
 * Gradient orbs, overlays, and ambient effects
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

// --- Types ---

interface OrbConfig {
  size: number;
  position: { left?: string; right?: string; top?: string; bottom?: string };
  color: string;
  animation: {
    scale: number[];
    opacity: number[];
    x?: number[];
    y?: number[];
  };
  duration: number;
  delay?: number;
}

interface BackgroundEffectsProps {
  variant: 'default' | 'processing' | 'result';
  result: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkTheme: boolean;
  shouldAnimate: boolean;
  overlayPattern?: string;
  overlayOpacity?: number;
  pulsing?: boolean;
  resultColors: string[];
}

// --- Orb Component ---

interface GradientOrbProps extends OrbConfig {
  keyId: string;
}

const GradientOrb = memo(function GradientOrb({
  keyId,
  size,
  position,
  color,
  animation,
  duration,
  delay = 0,
}: GradientOrbProps) {
  return (
    <motion.div
      key={keyId}
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        ...position,
        background: color,
      }}
      animate={{
        scale: animation.scale,
        opacity: animation.opacity,
        x: animation.x || [0, 0, 0],
        y: animation.y || [0, 0, 0],
      }}
      transition={{ duration, repeat: Infinity, repeatType: 'reverse', delay }}
    />
  );
});

// --- Radial Glow Layer ---

interface RadialGlowProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkTheme: boolean;
}

const RadialGlow = memo(function RadialGlow({
  primaryColor,
  secondaryColor,
  accentColor,
  isDarkTheme,
}: RadialGlowProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `
          radial-gradient(circle at 15% 15%, ${primaryColor}${isDarkTheme ? '55' : '70'} 0%, transparent 45%),
          radial-gradient(circle at 85% 85%, ${secondaryColor}${isDarkTheme ? '55' : '70'} 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, ${accentColor}${isDarkTheme ? '45' : '60'} 0%, transparent 55%),
          radial-gradient(circle at 75% 25%, ${primaryColor}${isDarkTheme ? '35' : '50'} 0%, transparent 40%),
          radial-gradient(circle at 25% 75%, ${secondaryColor}${isDarkTheme ? '35' : '50'} 0%, transparent 40%)
        `,
        filter: 'blur(80px)',
        opacity: isDarkTheme ? 0.5 : 0.6,
      }}
    />
  );
});

// --- Shimmer Effect (Light Mode) ---

interface ShimmerEffectProps {
  primaryColor: string;
  secondaryColor: string;
}

const ShimmerEffect = memo(function ShimmerEffect({ primaryColor, secondaryColor }: ShimmerEffectProps) {
  return (
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
  );
});

// --- Pulsing Overlay ---

interface PulsingOverlayProps {
  primaryColor: string;
  isDarkTheme: boolean;
}

const PulsingOverlay = memo(function PulsingOverlay({ primaryColor, isDarkTheme }: PulsingOverlayProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${primaryColor}${isDarkTheme ? '25' : '35'} 0%, transparent 65%)`,
      }}
      animate={{
        opacity: isDarkTheme ? [0.4, 0.7, 0.4] : [0.45, 0.75, 0.45],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// --- Pattern Overlay ---

interface PatternOverlayProps {
  pattern: string;
  opacity: number;
}

const PatternOverlay = memo(function PatternOverlay({ pattern, opacity }: PatternOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url(${pattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity,
      }}
    />
  );
});

// --- Ambient Orbs for Default State ---

interface DefaultOrbsProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkTheme: boolean;
}

const DefaultOrbs = memo(function DefaultOrbs({
  primaryColor,
  secondaryColor,
  accentColor,
  isDarkTheme,
}: DefaultOrbsProps) {
  const orbs: OrbConfig[] = [
    {
      size: 400,
      position: { left: '20%', top: '20%' },
      color: isDarkTheme ? `${primaryColor}55` : `${primaryColor}65`,
      animation: {
        scale: [1, 1.25, 1],
        opacity: isDarkTheme ? [0.5, 0.8, 0.5] : [0.55, 0.8, 0.55],
        x: [0, 40, 0],
        y: [0, -30, 0],
      },
      duration: 8,
    },
    {
      size: 350,
      position: { right: '15%', bottom: '25%' },
      color: isDarkTheme ? `${secondaryColor}50` : `${secondaryColor}60`,
      animation: {
        scale: [1, 1.35, 1],
        opacity: isDarkTheme ? [0.4, 0.7, 0.4] : [0.5, 0.75, 0.5],
        x: [0, -30, 0],
        y: [0, 35, 0],
      },
      duration: 10,
      delay: 1,
    },
    {
      size: 300,
      position: { left: '55%', top: '55%' },
      color: isDarkTheme ? `${accentColor}45` : `${accentColor}55`,
      animation: {
        scale: [1, 1.2, 1],
        opacity: isDarkTheme ? [0.35, 0.6, 0.35] : [0.45, 0.7, 0.45],
      },
      duration: 12,
      delay: 2,
    },
    {
      size: 280,
      position: { left: '10%', bottom: '15%' },
      color: isDarkTheme ? `${accentColor}40` : `${primaryColor}50`,
      animation: {
        scale: [1, 1.15, 1],
        opacity: isDarkTheme ? [0.3, 0.5, 0.3] : [0.4, 0.6, 0.4],
        x: [0, 20, 0],
        y: [0, -15, 0],
      },
      duration: 14,
      delay: 3,
    },
  ];

  return (
    <>
      {orbs.map((orb, index) => (
        <GradientOrb key={`orb-${index}`} keyId={`orb-${index}`} {...orb} />
      ))}
    </>
  );
});

// --- Processing Orb ---

const ProcessingOrb = memo(function ProcessingOrb() {
  return (
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
  );
});

// --- Result Orb ---

interface ResultOrbProps {
  color: string;
}

const ResultOrb = memo(function ResultOrb({ color }: ResultOrbProps) {
  return (
    <motion.div
      key="result-orb"
      className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
      style={{ backgroundColor: color }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.4, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    />
  );
});

// --- Main Component ---

function BackgroundEffects({
  variant,
  result,
  primaryColor,
  secondaryColor,
  accentColor,
  isDarkTheme,
  shouldAnimate,
  overlayPattern,
  overlayOpacity = 0.05,
  pulsing,
  resultColors,
}: BackgroundEffectsProps) {
  return (
    <>
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-5 dark:opacity-[0.03]" />

      {/* Radial Glow Effects */}
      <RadialGlow
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        isDarkTheme={isDarkTheme}
      />

      {/* Pattern Overlay */}
      {overlayPattern && <PatternOverlay pattern={overlayPattern} opacity={overlayOpacity} />}

      {/* Light Mode Shimmer */}
      {!isDarkTheme && shouldAnimate && <ShimmerEffect primaryColor={primaryColor} secondaryColor={secondaryColor} />}

      {/* Pulsing Overlay */}
      {pulsing && shouldAnimate && <PulsingOverlay primaryColor={primaryColor} isDarkTheme={isDarkTheme} />}

      {/* Ambient Orbs */}
      <AnimatePresence mode="wait">
        {variant === 'default' && (
          <DefaultOrbs
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            isDarkTheme={isDarkTheme}
          />
        )}

        {variant === 'processing' && <ProcessingOrb />}

        {variant === 'result' && result && <ResultOrb color={resultColors[0] || 'rgba(255, 255, 255, 0.4)'} />}
      </AnimatePresence>
    </>
  );
}

export default memo(BackgroundEffects);
