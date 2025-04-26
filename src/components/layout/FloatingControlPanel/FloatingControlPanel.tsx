import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Flame, Volume2, VolumeX, ChevronUp, Settings, MousePointerClick } from 'lucide-react';
import { usePreferences } from '../../../hooks/usePreferences';
import Toggle from '../../ui/Toggle';

interface FloatingControlPanelProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

export default function FloatingControlPanel({
  animationsEnabled,
  setAnimationsEnabled
}: FloatingControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [exitingPanel, setExitingPanel] = useState(false); // Track panel closing state
  
  const [
    { isDarkTheme, isSoundEnabled },
    { toggleTheme, toggleSound, toggleAnimations }
  ] = usePreferences();

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

  // Local wrapper for toggling animations to ensure parent state is updated too
  const handleToggleAnimations = useCallback(() => {
    toggleAnimations();
    setAnimationsEnabled(!animationsEnabled);
  }, [animationsEnabled, toggleAnimations, setAnimationsEnabled]);

  // Handle scroll to top with proper focus management
  const handleScrollToTop = useCallback(() => {
    const firstFocusableElement = document.querySelector('main button, main a, main input, main [tabindex="0"]');
    window.scrollTo({ 
      top: 0, 
      behavior: prefersReducedMotion ? 'auto' : 'smooth' 
    });
    
    // Animate panel closing
    setExitingPanel(true);
    setTimeout(() => {
      setIsExpanded(false);
      setExitingPanel(false);
    }, 300);
    
    // Set focus after scroll completes
    setTimeout(() => {
      if (firstFocusableElement instanceof HTMLElement) {
        firstFocusableElement.focus();
      }
    }, prefersReducedMotion ? 0 : 500);
  }, [prefersReducedMotion]);

  const controls = [
    {
      label: 'Theme',
      activeIcon: Sun,
      inactiveIcon: Moon,
      active: !isDarkTheme,
      toggle: toggleTheme,
      color: 'bg-yellow-50 dark:bg-indigo-900/70',
      activeColor: 'text-yellow-500',
      inactiveColor: 'text-indigo-400'
    },
    {
      label: 'Animations',
      activeIcon: Flame,
      inactiveIcon: Flame,
      active: animationsEnabled,
      toggle: handleToggleAnimations,
      color: 'bg-orange-50 dark:bg-orange-950/70',
      activeColor: 'text-orange-500',
      inactiveColor: 'text-gray-400'
    },
    {
      label: 'Sound',
      activeIcon: Volume2,
      inactiveIcon: VolumeX,
      active: isSoundEnabled,
      toggle: toggleSound,
      color: 'bg-green-50 dark:bg-green-950/70',
      activeColor: 'text-green-500',
      inactiveColor: 'text-gray-400'
    }
  ];

  // Only show animations if they're enabled and user doesn't prefer reduced motion
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;

  // Define animation variants
  const panelVariants = {
    collapsed: { 
      width: '48px',
      height: '48px', 
      borderRadius: '24px',
    },
    expanded: { 
      width: '220px', 
      height: 'auto',
      borderRadius: '16px',
    }
  };
  
  // Staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 }
  };

  return (
    <div className="fixed top-5 right-5 md:top-6 md:right-6 z-50">
      <motion.div
        className={`backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-lg 
                   border border-gray-200 dark:border-gray-700 overflow-hidden
                   ${exitingPanel ? 'transition-all duration-300' : ''}`}
        variants={panelVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.3
        }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            absolute ${isExpanded ? 'top-3 right-3' : 'inset-0'} 
            rounded-full 
            flex items-center justify-center
            ${isExpanded 
              ? 'w-8 h-8 bg-white/90 dark:bg-gray-800/90 shadow-sm' 
              : 'w-full h-full bg-transparent'}
            text-gray-600 dark:text-gray-300
            hover:bg-white dark:hover:bg-gray-800 
            z-20
          `}
          aria-label={isExpanded ? "Collapse control panel" : "Expand control panel"}
        >
          {isExpanded ? (
            <ChevronUp size={18} />
          ) : (
            <Settings 
              size={20} 
              className={shouldAnimate ? 'animate-spin-slow' : ''} 
            />
          )}
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="pt-14 pb-3 px-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h3 
                variants={childVariants}
                className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3 text-center"
              >
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Preferences
                </span>
              </motion.h3>
              
              <div className="space-y-3">
                {controls.map((control) => (
                  <motion.div
                    key={control.label}
                    variants={childVariants}
                  >
                    <Toggle
                      isActive={control.active}
                      onToggle={control.toggle}
                      activeIcon={control.activeIcon}
                      inactiveIcon={control.inactiveIcon}
                      label={control.label}
                      activeColor={control.activeColor}
                      inactiveColor={control.inactiveColor}
                      backgroundColor={control.color}
                    />
                  </motion.div>
                ))}
                
                <motion.div
                  className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
                  variants={childVariants}
                >
                  <button 
                    className="flex items-center justify-center w-full gap-1.5 py-1.5 px-2 rounded-md
                              hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 
                              transition-colors"
                    aria-label="Jump to input section"
                    onClick={handleScrollToTop}
                  >
                    <MousePointerClick size={12} />
                    <span>Jump to top</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && shouldAnimate && (
          <motion.div 
            className="h-12 w-12 flex items-center justify-center absolute inset-0"
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 4
            }}
          />
        )}
      </motion.div>
    </div>
  );
}