import Logo from '@components/ui/Logo';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookOpen, Flame, Wand2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const navigate = useNavigate();
  const { prefersReducedMotion } = useAnimationPreferences();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle navigation and close menu with enhanced feedback
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  // Enhanced focus management and keyboard trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Close on escape key
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Enhanced focus trap within menu
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusable[0] as HTMLElement;
        const lastElement = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Enhanced auto-focus close button when menu opens
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 150);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Enhanced animation variants with smoother transitions
  const backdropVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.2 },
    },
    visible: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.3 },
    },
  };

  const menuVariants = {
    hidden: {
      x: '100%',
      transition: {
        type: prefersReducedMotion ? 'tween' : 'spring',
        damping: 30,
        stiffness: 300,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: prefersReducedMotion ? 'tween' : 'spring',
        damping: 25,
        stiffness: 300,
        duration: prefersReducedMotion ? 0.3 : undefined,
      },
    },
  };

  // Enhanced container variants for staggered children animations
  const containerVariants = {
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: prefersReducedMotion ? 0 : 0.03,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: 30,
      y: 10,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.4,
      },
    },
  };

  // Navigation items with enhanced configuration
  const navItems = [
    {
      label: 'Home',
      icon: Flame,
      path: '/',
      isActive: pathname === '/',
      description: 'Play the FLAMES game',
    },
    {
      label: 'How it Works',
      icon: BookOpen,
      path: '/how-it-works',
      isActive: pathname === '/how-it-works',
      description: 'Learn about FLAMES',
    },
    {
      label: 'Global Charts',
      icon: BarChart3,
      path: '/charts',
      isActive: pathname === '/charts',
      description: 'View global statistics',
    },
    {
      label: 'Manual Mode',
      icon: Wand2,
      path: '/manual',
      isActive: pathname === '/manual',
      description: 'Step-by-step calculation',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-60 flex md:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-heading"
        >
          {/* Enhanced backdrop with better blur effect */}
          <motion.div
            className="bg-scrim/50 absolute inset-0 backdrop-blur-md"
            variants={backdropVariants}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Enhanced menu panel with modern styling */}
          <motion.div
            ref={menuRef}
            className="bg-surface/95 border-outline/20 absolute top-0 right-0 h-full w-80 overflow-hidden border-l shadow-2xl backdrop-blur-xl"
            variants={menuVariants}
          >
            {/* Enhanced gradient overlay for depth */}
            <div className="from-surface/90 via-surface/95 to-surface-container/90 absolute inset-0 bg-gradient-to-b" />

            {/* Header with better visual hierarchy */}
            <div className="border-outline/10 relative border-b">
              <div className="flex items-center justify-between p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <h2 id="mobile-menu-heading" className="text-on-surface text-lg font-semibold">
                    Navigation
                  </h2>
                  <p className="text-on-surface-variant mt-1 text-sm">Choose your destination</p>
                </motion.div>

                <motion.button
                  ref={closeButtonRef}
                  className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low focus:ring-primary/30 group relative rounded-full p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                  onClick={onClose}
                  aria-label="Close mobile menu"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {/* Enhanced close button background */}
                  <motion.div
                    className="bg-surface-container-low/50 absolute inset-0 rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <X className="relative z-10 h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Decorative accent line */}
              <motion.div
                className="via-primary/30 absolute right-6 bottom-0 left-6 h-px bg-gradient-to-r from-transparent to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>

            {/* Enhanced navigation section */}
            <nav className="relative px-6 py-6" role="navigation" aria-label="Mobile navigation">
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                {navItems.map((item, _index) => (
                  <motion.div key={item.path} variants={itemVariants} className="group">
                    {/* Enhanced nav item wrapper */}
                    <div className="relative">
                      <NavItem
                        label={item.label}
                        icon={item.icon}
                        isActive={item.isActive}
                        onClick={() => handleNavigation(item.path)}
                        mobileOnly
                        className="w-full justify-start"
                      />

                      {/* Subtle description text */}
                      <motion.p
                        className="text-on-surface-variant/70 mt-1 ml-10 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {item.description}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}

                {/* Enhanced settings note */}
                <motion.div variants={itemVariants} className="pt-6">
                  <div className="via-outline/20 mb-4 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
                  <div className="bg-surface-container/50 border-outline/10 rounded-xl border p-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                        <span className="text-primary font-medium">💡 Pro tip:</span> Use the floating settings panel to
                        customize your theme and animation preferences.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </nav>

            {/* Enhanced footer with brand info and subtle animation */}
            <motion.div
              className="from-surface-container/80 via-surface/50 absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="flex flex-col items-center space-y-3">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Logo
                    variant="animated"
                    animationType="continuous"
                    showText={false}
                    className="opacity-80 transition-opacity duration-300 hover:opacity-100"
                  />
                </motion.div>

                <div className="text-center">
                  <p className="text-on-surface-variant/70 text-sm">© {new Date().getFullYear()} OSLabs</p>
                  <motion.p
                    className="text-on-surface-variant/50 mt-1 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    Made with ❤️ for love calculations
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
