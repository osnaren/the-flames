import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookOpen, Flame, Moon, Sun, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, isDarkTheme, toggleTheme, pathname }: MobileMenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-60 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop */}
          <motion.div
            className="bg-scrim/40 absolute inset-0 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu panel */}
          <motion.div
            className="bg-surface absolute top-0 right-0 h-full w-64 shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-4">
              <div className="border-outline/20 mb-8 flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <Flame className="text-primary h-5 w-5" aria-hidden="true" />
                  <span className="text-on-surface ml-2 text-lg font-bold">FLAMES</span>
                </div>
                <button
                  className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest rounded-full p-2 transition-colors"
                  onClick={onClose}
                  aria-label="Close mobile menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                <NavItem
                  label="Home"
                  icon={Flame}
                  isActive={pathname === '/'}
                  onClick={() => handleNavigation('/')}
                  mobileOnly
                />
                <NavItem
                  label="How it Works"
                  icon={BookOpen}
                  isActive={pathname === '/how-it-works'}
                  onClick={() => handleNavigation('/how-it-works')}
                  mobileOnly
                />
                <NavItem
                  label="Global Charts"
                  icon={BarChart3}
                  isActive={pathname === '/charts'}
                  onClick={() => handleNavigation('/charts')}
                  mobileOnly
                />
                <NavItem
                  label="Manual Mode"
                  icon={Wand2}
                  isActive={pathname === '/manual'}
                  onClick={() => handleNavigation('/manual')}
                  mobileOnly
                />
                <NavItem
                  label={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  icon={isDarkTheme ? Sun : Moon}
                  onClick={toggleTheme}
                  mobileOnly
                />
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
