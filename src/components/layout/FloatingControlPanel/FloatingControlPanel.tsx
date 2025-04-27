import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Flame, Moon, MousePointerClick, Settings, Sun, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { usePreferences } from '../../../hooks/usePreferences';
import Toggle from '../../ui/Toggle';

interface FloatingControlPanelProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

export default function FloatingControlPanel({ animationsEnabled, setAnimationsEnabled }: FloatingControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [exitingPanel, setExitingPanel] = useState(false); // Track panel closing state

  const [{ isDarkTheme, isSoundEnabled }, { toggleTheme, toggleSound, toggleAnimations }] = usePreferences();

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
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Animate panel closing
    setExitingPanel(true);
    setTimeout(() => {
      setIsExpanded(false);
      setExitingPanel(false);
    }, 300);

    // Set focus after scroll completes
    setTimeout(
      () => {
        if (firstFocusableElement instanceof HTMLElement) {
          firstFocusableElement.focus();
        }
      },
      prefersReducedMotion ? 0 : 500
    );
  }, [prefersReducedMotion]);

  const controls = [
    {
      label: 'Theme',
      activeIcon: Sun,
      inactiveIcon: Moon,
      active: !isDarkTheme,
      toggle: toggleTheme,
      color: 'bg-gradient-to-r from-tertiary-container/30 to-tertiary/10',
      activeColor: 'text-primary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
    },
    {
      label: 'Animations',
      activeIcon: Flame,
      inactiveIcon: Flame,
      active: animationsEnabled,
      toggle: handleToggleAnimations,
      color: 'bg-gradient-to-r from-primary-container/30 to-primary/10',
      activeColor: 'text-primary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
    },
    {
      label: 'Sound',
      activeIcon: Volume2,
      inactiveIcon: VolumeX,
      active: isSoundEnabled,
      toggle: toggleSound,
      color: 'bg-gradient-to-r from-secondary-container/30 to-secondary/10',
      activeColor: 'text-secondary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
    },
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
    },
  };

  // Staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  return (
    <div className="fixed top-20 right-5 z-50 md:top-6 md:right-6">
      <motion.div
        className={`from-surface-container-low/90 to-surface-container-high/80 border-outline/20 overflow-hidden border bg-gradient-to-br shadow-lg backdrop-blur-lg ${isExpanded ? 'shadow-[0_0_15px_2px_rgba(255,255,255,0.1)] dark:shadow-[0_0_15px_2px_rgba(255,182,144,0.15)]' : ''} // Adjusted glow ${exitingPanel ? 'transition-all duration-300' : ''}`}
        variants={panelVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          duration: 0.3,
        }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute ${isExpanded ? 'top-3 right-3' : 'inset-0'} flex items-center justify-center rounded-full ${
            isExpanded
              ? 'from-surface-container-high to-surface-container h-8 w-8 bg-gradient-to-br shadow-sm'
              : 'h-full w-full bg-transparent'
          } text-on-surface-variant hover:text-primary hover:bg-surface-container-low hover:text-glow-sm z-20`}
          aria-label={isExpanded ? 'Collapse control panel' : 'Expand control panel'}
        >
          {isExpanded ? (
            <ChevronUp size={18} />
          ) : (
            <Settings size={20} className={shouldAnimate ? 'animate-spin-slow' : ''} />
          )}
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="px-3 pt-14 pb-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h3
                variants={childVariants}
                className="text-on-surface-variant mb-3 text-center text-xs font-medium tracking-wider uppercase"
              >
                <span className="from-primary via-primary-container to-error bg-gradient-to-r bg-clip-text text-transparent">
                  Preferences
                </span>
              </motion.h3>

              <div className="space-y-3">
                {controls.map((control) => (
                  <motion.div key={control.label} variants={childVariants}>
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
                  className="text-on-surface-variant border-outline/20 mt-4 border-t pt-3 text-center text-xs"
                  variants={childVariants}
                >
                  <button
                    className="hover:text-on-surface hover:bg-surface-container-lowest hover:text-glow-sm flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 transition-colors"
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
            className="absolute inset-0 flex h-12 w-12 items-center justify-center"
            animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
