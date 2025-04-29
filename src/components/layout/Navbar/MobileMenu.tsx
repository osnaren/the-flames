import Logo from '@components/ui/Logo';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const prefersReducedMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle navigation and close menu
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  // Focus management and keyboard trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Close on escape key
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus within menu
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

    // Auto-focus close button when menu opens
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }

    // Re-enable scrolling when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  // Navigation items with staggered animation
  const navItems = [
    { label: 'Home', icon: Flame, path: '/', isActive: pathname === '/' },
    { label: 'How it Works', icon: BookOpen, path: '/how-it-works', isActive: pathname === '/how-it-works' },
    { label: 'Global Charts', icon: BarChart3, path: '/charts', isActive: pathname === '/charts' },
    { label: 'Manual Mode', icon: Wand2, path: '/manual', isActive: pathname === '/manual' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-60 flex md:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-heading"
        >
          {/* Backdrop */}
          <motion.div
            className="bg-scrim/40 absolute inset-0 backdrop-blur-sm"
            variants={backdropVariants}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <motion.div
            ref={menuRef}
            className="bg-surface absolute top-0 right-0 h-full w-72 overflow-y-auto shadow-xl"
            variants={menuVariants}
            transition={{
              type: prefersReducedMotion ? 'tween' : 'spring',
              damping: 25,
              stiffness: 300,
              duration: prefersReducedMotion ? 0.2 : undefined,
            }}
          >
            {/* Header */}
            <div className="border-outline/20 mb-6 border-b">
              <div className="flex items-center justify-end p-4">
                <h2 id="mobile-menu-heading" className="sr-only">
                  Mobile navigation menu
                </h2>
                <motion.button
                  ref={closeButtonRef}
                  className="text-on-surface-variant hover:bg-surface-container-lowest active:bg-surface-container focus:ring-primary/30 rounded-full p-2 transition-colors focus:ring-2"
                  onClick={onClose}
                  aria-label="Close mobile menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="px-4 pb-16" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : index * 0.05,
                      duration: 0.3,
                    }}
                  >
                    <NavItem
                      label={item.label}
                      icon={item.icon}
                      isActive={item.isActive}
                      onClick={() => handleNavigation(item.path)}
                      mobileOnly
                    />
                  </motion.div>
                ))}

                {/* Note about settings - direct users to the control panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : navItems.length * 0.05,
                    duration: 0.3,
                  }}
                  className="pt-4"
                >
                  <div className="bg-outline/20 mb-4 h-px w-full"></div>
                  <p className="text-on-surface-variant/70 px-3 py-2 text-xs italic">
                    Use the settings panel for theme and animation controls.
                  </p>
                </motion.div>
              </div>
            </nav>

            {/* Footer brand info */}
            <motion.div
              className="from-surface to-surface/5 text-on-surface-variant absolute right-0 bottom-0 left-0 bg-gradient-to-t p-4 pt-12 pb-8 text-center text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <Logo variant="animated" animationType="continuous" showText={false} />
                <p className="mt-2">© {new Date().getFullYear()} OSLabs</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
