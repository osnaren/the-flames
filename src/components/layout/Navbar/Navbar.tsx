import Logo from '@components/ui/Logo';
import { usePreferences } from '@hooks/usePreferences';
import FloatingControlPanel from '@layout/FloatingControlPanel';
import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, BookOpen, Menu, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import NavItem from './NavItem';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // For scroll direction detection
  const lastScrollTop = useRef(0);

  // Get theme preferences
  const [{ animationsEnabled }, { toggleAnimations }] = usePreferences();

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const currentScrollTop = window.scrollY;

    // Detect if scrolled past threshold
    setIsScrolled(currentScrollTop > 10);

    // Auto-hide navbar when scrolling down on mobile
    if (window.innerWidth < 768) {
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 100) {
        setIsVisible(false); // Scrolling down, hide navbar
      } else {
        setIsVisible(true); // Scrolling up, show navbar
      }
    } else {
      setIsVisible(true); // Always show on desktop
    }

    lastScrollTop.current = currentScrollTop;
  }, []);

  // Optimized scroll listener with throttling
  useEffect(() => {
    let ticking = false;

    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

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

  // Reset visibility when pathname changes
  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-30 backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? 'border-outline/30 border-b shadow-lg' : ''
        } ${
          isScrolled
            ? 'from-surface/90 via-surface/95 to-surface/90 bg-gradient-to-r'
            : 'from-surface/70 via-surface/75 to-surface/70 bg-gradient-to-r'
        }`}
        initial={{ y: prefersReducedMotion ? 0 : -100 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 100,
          opacity: { duration: 0.2 },
        }}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and brand name */}
            <Logo
              variant="animated"
              animationType={isScrolled ? 'onHover' : 'continuous'}
              className="transition-all duration-300"
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center space-x-3 md:flex" role="navigation" aria-label="Main navigation">
              <NavItem
                label="How it Works"
                icon={BookOpen}
                to="/how-it-works"
                isActive={pathname === '/how-it-works'}
              />
              <NavItem label="Global Charts" icon={BarChart3} to="/charts" isActive={pathname === '/charts'} />
              <NavItem label="Manual Mode" icon={Wand2} to="/manual" isActive={pathname === '/manual'} />
            </nav>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface rounded-lg p-2 transition-all duration-200 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Space filler for fixed header - adjust height based on actual navbar height */}
      <div className="h-[56px]" aria-hidden="true"></div>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} pathname={pathname} />

      {/* Floating Control Panel - now positioned independently outside the navbar */}
      <FloatingControlPanel animationsEnabled={animationsEnabled} setAnimationsEnabled={toggleAnimations} />
    </>
  );
}
