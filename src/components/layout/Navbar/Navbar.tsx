import { usePreferences } from '@hooks/usePreferences';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Flame, Menu, Moon, Sun, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import NavItem from './NavItem';

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
        className={`fixed top-0 right-0 left-0 z-30 backdrop-blur-lg transition-all duration-300 ${isScrolled ? 'border-outline/30 border-b shadow-lg' : ''} ${
          isScrolled
            ? 'from-surface/80 via-surface/90 to-surface/80 bg-gradient-to-r'
            : 'from-surface/60 via-surface/70 to-surface/60 bg-gradient-to-r'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and brand name */}
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <Link to="/" className="group flex items-center" aria-label="FLAMES Home">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    repeatType: 'reverse',
                  }}
                >
                  <Flame
                    className="text-primary text-glow-sm h-6 w-6 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                </motion.div>
                <span className="from-primary to-error ml-2 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                  FLAMES
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center space-x-2 md:flex" role="navigation" aria-label="Main navigation">
              <NavItem
                label="How it Works"
                icon={BookOpen}
                to="/how-it-works"
                isActive={pathname === '/how-it-works'}
              />
              <NavItem label="Global Charts" icon={BarChart3} to="/charts" isActive={pathname === '/charts'} />
              <NavItem label="Manual Mode" icon={Wand2} to="/manual" isActive={pathname === '/manual'} />
              <div className="bg-outline/30 mx-2 h-6 w-px" role="separator"></div>
              <NavItem
                label={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                icon={isDarkTheme ? Sun : Moon}
                onClick={toggleTheme}
                className="transition-transform"
              />
            </nav>

            {/* Mobile menu button */}
            <button
              className="text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface rounded-lg p-2 transition-all duration-200 md:hidden"
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
