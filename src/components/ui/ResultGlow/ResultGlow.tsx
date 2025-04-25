import { motion, AnimatePresence } from 'framer-motion';
import { FlamesResult } from '../../../features/flamesGame/flames.types';
import { resultVisuals } from '../../../features/flamesGame/resultVisuals';
import { useEffect, useState, useMemo, memo } from 'react';

interface ResultGlowProps {
  result: FlamesResult;
  isVisible: boolean;
  animationsEnabled: boolean;
}

/**
 * A dynamic radial glow background that changes based on the FLAMES result
 * Memoized to prevent unnecessary re-renders
 */
function ResultGlow({ 
  result, 
  isVisible,
  animationsEnabled 
}: ResultGlowProps) {
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
  
  // Get the appropriate colors based on the result
  const glowColor = useMemo(() => {
    if (!result) return 'rgba(249, 115, 22, 0.4)'; // Enhanced orange glow
    return resultVisuals[result].glowColor;
  }, [result]);
  
  const darkGlowColor = useMemo(() => {
    if (!result) return 'rgba(234, 88, 12, 0.5)'; // Enhanced dark orange glow
    return resultVisuals[result].darkGlowColor;
  }, [result]);
  
  // Get accessible label for the glow effect
  const accessibilityLabel = useMemo(() => {
    if (!result) return 'Decorative background glow';
    return resultVisuals[result].accessibilityLabel;
  }, [result]);
  
  // No animations, return an enhanced static glow
  if (!shouldAnimate) {
    return isVisible ? (
      <div 
        className="absolute inset-0 rounded-xl overflow-hidden -z-10 opacity-70 dark:opacity-50"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          boxShadow: `0 0 30px 5px ${glowColor}`
        }}
        aria-hidden="true"
        role="presentation"
      />
    ) : null;
  }
  
  // With animations, return the animated glow effect
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
          role="presentation"
          aria-label={accessibilityLabel}
        >
          <motion.div 
            className="absolute inset-0 dark:opacity-90" 
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(20px)'
            }}
            animate={shouldAnimate ? {
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.9, 0.7], // Enhanced light mode visibility
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div 
            className="absolute inset-0 dark:opacity-90" 
            style={{
              background: `radial-gradient(circle at 30% 70%, ${darkGlowColor} 0%, transparent 50%)`,
              filter: 'blur(15px)'
            }}
            animate={shouldAnimate ? {
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5], // Enhanced light mode visibility
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ResultGlow);