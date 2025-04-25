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
    setIsExpanded(false);
    
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
      color: 'bg-yellow-100 dark:bg-indigo-900',
      activeColor: 'text-yellow-500',
      inactiveColor: 'text-indigo-400'
    },
    {
      label: 'Animations',
      activeIcon: Flame,
      inactiveIcon: Flame,
      active: animationsEnabled,
      toggle: handleToggleAnimations,
      color: 'bg-orange-100 dark:bg-orange-950',
      activeColor: 'text-orange-500',
      inactiveColor: 'text-gray-400'
    },
    {
      label: 'Sound',
      activeIcon: Volume2,
      inactiveIcon: VolumeX,
      active: isSoundEnabled,
      toggle: toggleSound,
      color: 'bg-green-100 dark:bg-green-950',
      activeColor: 'text-green-500',
      inactiveColor: 'text-gray-400'
    }
  ];

  // Only show animations if they're enabled and user doesn't prefer reduced motion
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        className={`backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-lg 
                   border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300
                   ${isExpanded ? 'w-52' : 'w-10'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 
                    hover:bg-white dark:hover:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300
                    transition-all hover:scale-110"
          aria-label={isExpanded ? "Collapse control panel" : "Expand control panel"}
        >
          {isExpanded ? (
            <ChevronUp size={16} />
          ) : (
            <Settings 
              size={16} 
              className={shouldAnimate ? 'animate-spin-slow' : ''} 
            />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="pt-10 pb-3 px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3 text-center text-shadow-sm">
                Preferences
              </h3>
              
              <div className="space-y-2.5">
                {controls.map((control, index) => (
                  <motion.div
                    key={control.label}
                    initial={shouldAnimate ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldAnimate ? index * 0.1 : 0 }}
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
                  className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button 
                    className="flex items-center justify-center w-full gap-1.5 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
            className="h-10 w-10 flex items-center justify-center"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 5
            }}
          />
        )}
      </motion.div>
    </div>
  );
}