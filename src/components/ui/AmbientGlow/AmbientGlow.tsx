import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, memo } from 'react';

interface AmbientGlowProps {
  isVisible: boolean;
  animationsEnabled: boolean;
}

/**
 * Creates a warm, ambient glow background for the form screens
 * Used before the result is revealed
 * Memoized to prevent unnecessary re-renders
 */
function AmbientGlow({ 
  isVisible,
  animationsEnabled 
}: AmbientGlowProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Update if preference changes
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  // Should we enable animations based on both user settings and system preferences
  const shouldAnimate = useMemo(() => {
    return animationsEnabled && !prefersReducedMotion;
  }, [animationsEnabled, prefersReducedMotion]);
  
  if (!isVisible) return null;
  
  // Simple static glow for when animations are disabled or reduced motion preferred
  if (!shouldAnimate) {
    return (
      <div 
        className="absolute inset-0 -z-10 rounded-xl overflow-hidden opacity-60 dark:opacity-50"
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30 dark:from-orange-500/30 dark:to-red-500/30" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full"
          style={{
            boxShadow: '0 0 60px 20px rgba(249, 115, 22, 0.3)',
            background: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.4) 0%, transparent 70%)'
          }}
        />
      </div>
    );
  }
  
  // Animated ambient glow when animations are enabled
  return (
    <div 
      className="absolute inset-0 -z-10 rounded-xl overflow-hidden"
      aria-hidden="true"
      role="presentation"
      aria-label="Decorative ambient background glow"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30 dark:from-orange-700/30 dark:to-red-700/30"
        animate={{
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.3) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0, -5, 0],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.25) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AmbientGlow);