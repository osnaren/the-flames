import { AnimatePresence, motion } from 'framer-motion';
import NavItem from './NavItem';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Flame, BarChart3, Wand2, BookOpen } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  isDarkTheme,
  toggleTheme,
  pathname
}: MobileMenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu panel */}
          <motion.div
            className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
                  <span className="text-lg font-bold ml-2 text-gray-900 dark:text-white">
                    FLAMES
                  </span>
                </div>
                <button
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                  label={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
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