import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, BarChart3, Wand2, Menu, Moon, Sun, BookOpen } from 'lucide-react';
import NavItem from './NavItem';
import MobileMenu from './MobileMenu';
import { usePreferences } from '../../../hooks/usePreferences';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  
  // Get theme preferences
  const [{ isDarkTheme }, { toggleTheme }] = usePreferences();

  // Show box shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-lg transition-all duration-300
                  ${isScrolled ? 'shadow-lg border-b border-gray-200/50 dark:border-gray-800/50' : ''}
                  ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80' : 'bg-white/60 dark:bg-gray-900/60'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and brand name */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                to="/" 
                className="flex items-center group"
                aria-label="FLAMES Home"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    repeatType: "reverse"
                  }}
                >
                  <Flame 
                    className="h-6 w-6 text-orange-500 dark:text-orange-400 
                             transition-transform group-hover:scale-110" 
                    aria-hidden="true"
                  />
                </motion.div>
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent 
                               bg-gradient-to-r from-orange-500 to-red-500 
                               dark:from-orange-400 dark:to-red-400">
                  FLAMES
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation Links */}
            <nav 
              className="hidden md:flex items-center space-x-2"
              role="navigation"
              aria-label="Main navigation"
            >
              <NavItem 
                label="How it Works" 
                icon={BookOpen} 
                to="/how-it-works" 
                isActive={pathname === '/how-it-works'} 
              />
              <NavItem 
                label="Global Charts" 
                icon={BarChart3} 
                to="/charts" 
                isActive={pathname === '/charts'} 
              />
              <NavItem 
                label="Manual Mode" 
                icon={Wand2} 
                to="/manual"
                isActive={pathname === '/manual'} 
              />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" role="separator"></div>
              <NavItem 
                label={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
                icon={isDarkTheme ? Sun : Moon} 
                onClick={toggleTheme}
                className="hover:rotate-12 transition-transform"
              />
            </nav>
            
            {/* Mobile menu button */}
            <button
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 
                        dark:text-gray-400 dark:hover:text-white md:hidden
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Space filler for fixed header */}
      <div className="h-16" aria-hidden="true"></div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        pathname={pathname}
      />
    </>
  );
}