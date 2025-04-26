import { motion, AnimatePresence } from 'framer-motion';
import { FlamesResult } from '../../../features/flamesGame/flames.types';
import { getResultVisuals } from '../../../features/flamesGame/resultVisuals';
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
  const visualConfig = useMemo(() => {
    return getResultVisuals(result);
  }, [result]);
  
  const glowColor = visualConfig.glowColor;
  const darkGlowColor = visualConfig.darkGlowColor;
  const accessibilityLabel = visualConfig.accessibilityLabel;
  
  // No animations, return an enhanced static glow
  if (!shouldAnimate) {
    return isVisible ? (
      <div 
        className="absolute inset-0 rounded-xl overflow-hidden -z-10 opacity-80 dark:opacity-60"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          boxShadow: `0 0 40px 8px ${glowColor}`,
        }}
        aria-hidden="true"
        role="presentation"
      />
    ) : null;
  }
  
  // With animations, return the enhanced animated glow effect
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          aria-hidden="true"
          role="presentation"
          aria-label={accessibilityLabel}
        >
          {/* Primary central glow */}
          <motion.div 
            className="absolute inset-0 dark:opacity-90" 
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(25px)'
            }}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{
              scale: [0.9, 1.05, 1],
              opacity: [0.5, 0.9, 0.8],
            }}
            transition={{
              duration: 3,
              times: [0, 0.7, 1],
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary offset glow */}
          <motion.div 
            className="absolute inset-0 dark:opacity-90" 
            style={{
              background: `radial-gradient(circle at 30% 70%, ${darkGlowColor} 0%, transparent 55%)`,
              filter: 'blur(20px)'
            }}
            initial={{ scale: 1.1, opacity: 0.3 }}
            animate={{
              scale: [1.1, 1, 1.15],
              opacity: [0.5, 0.7, 0.5],
              x: [0, 10, -10, 0],
              y: [0, -10, 5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          {/* Accent glow particles */}
          <motion.div
            className="absolute h-32 w-32 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(8px)'
            }}
            initial={{ x: "20%", y: "20%", opacity: 0 }}
            animate={{
              x: ["20%", "30%", "25%"],
              y: ["20%", "25%", "35%"],
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div
            className="absolute h-24 w-24 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              filter: 'blur(6px)'
            }}
            initial={{ x: "70%", y: "30%", opacity: 0 }}
            animate={{
              x: ["70%", "65%", "75%"],
              y: ["30%", "25%", "20%"],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 7,
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