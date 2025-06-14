import Logo from '@components/ui/Logo';
import FloatingControlPanel from '@layout/FloatingControlPanel';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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
  const navbarRef = useRef<HTMLElement>(null);

  // Advanced scroll effects
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.3]);
  const blur = useTransform(scrollY, [0, 100], [8, 16]);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const currentScrollTop = window.scrollY;

    // Detect if scrolled past threshold with improved sensitivity
    setIsScrolled(currentScrollTop > 20);

    // Enhanced auto-hide navbar when scrolling down on mobile
    if (window.innerWidth < 768) {
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 120) {
        setIsVisible(false); // Scrolling down, hide navbar
      } else if (currentScrollTop < lastScrollTop.current || currentScrollTop <= 50) {
        setIsVisible(true); // Scrolling up or near top, show navbar
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

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  // Reset visibility when pathname changes with smooth transition
  useEffect(() => {
    setIsVisible(true);
    // Smooth scroll to top on navigation
    if (!prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, prefersReducedMotion]);

  // Enhanced navbar variants with micro-interactions
  const navbarVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        opacity: { duration: 0.2 },
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    hidden: {
      y: -100,
      opacity: 0.8,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        opacity: { duration: 0.15 },
        when: 'afterChildren',
      },
    },
  };

  const contentVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 20, stiffness: 300 },
    },
    hidden: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.header
        ref={navbarRef}
        className="fixed top-0 right-0 left-0 z-30 overflow-hidden transition-all duration-300"
        style={{
          backdropFilter: prefersReducedMotion ? 'blur(12px)' : `blur(${blur}px)`,
          WebkitBackdropFilter: prefersReducedMotion ? 'blur(12px)' : `blur(${blur}px)`,
        }}
        variants={navbarVariants}
        initial="visible"
        animate={isVisible ? 'visible' : 'hidden'}
        role="banner"
      >
        {/* Enhanced gradient background with dynamic opacity */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isScrolled
              ? 'linear-gradient(135deg, hsl(var(--surface) / var(--tw-bg-opacity)) 0%, hsl(var(--surface-container-low) / var(--tw-bg-opacity)) 50%, hsl(var(--surface) / var(--tw-bg-opacity)) 100%)'
              : 'linear-gradient(135deg, hsl(var(--surface) / 0.7) 0%, hsl(var(--surface-container-low) / 0.75) 50%, hsl(var(--surface) / 0.7) 100%)',
            opacity: prefersReducedMotion ? (isScrolled ? 0.95 : 0.7) : backgroundOpacity,
          }}
        />

        {/* Dynamic border with scroll-based opacity */}
        <motion.div
          className="via-outline/30 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent"
          style={{
            opacity: prefersReducedMotion ? (isScrolled ? 0.3 : 0) : borderOpacity,
          }}
        />

        {/* Enhanced glow effect for modern look */}
        {isScrolled && !prefersReducedMotion && (
          <motion.div
            className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-r via-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-3">
          <motion.div className="flex items-center justify-between" variants={contentVariants}>
            {/* Enhanced Logo with hover effect */}
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Logo
                variant="animated"
                animationType={isScrolled ? 'onHover' : 'continuous'}
                className="transition-all duration-300"
              />
            </motion.div>

            {/* Enhanced Desktop Navigation Links */}
            <nav className="hidden items-center space-x-2 md:flex" role="navigation" aria-label="Main navigation">
              <motion.div className="flex items-center space-x-2" variants={contentVariants}>
                <NavItem
                  label="How it Works"
                  icon={BookOpen}
                  to="/how-it-works"
                  isActive={pathname === '/how-it-works'}
                />
                <NavItem label="Global Charts" icon={BarChart3} to="/charts" isActive={pathname === '/charts'} />
                <NavItem label="Manual Mode" icon={Wand2} to="/manual" isActive={pathname === '/manual'} />
              </motion.div>
            </nav>

            {/* Enhanced Mobile menu button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: 'hsl(var(--surface-container-lowest) / 0.8)',
              }}
              whileTap={{ scale: 0.95 }}
              className="text-on-surface-variant hover:text-on-surface group relative rounded-lg p-2.5 transition-all duration-200 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              variants={contentVariants}
            >
              {/* Animated background on hover */}
              <motion.div
                className="bg-surface-container-lowest/50 absolute inset-0 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Enhanced menu icon with micro-animation */}
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </motion.div>

              {/* Subtle glow effect */}
              <motion.div
                className="bg-primary/20 absolute inset-0 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Subtle animated accent line */}
        {!prefersReducedMotion && (
          <motion.div
            className="from-primary via-secondary to-tertiary absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{
              scaleX: isScrolled ? 1 : 0,
              opacity: isScrolled ? 0.6 : 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </motion.header>

      {/* Enhanced space filler with dynamic height */}
      <motion.div
        className="transition-all duration-300"
        style={{ height: isScrolled ? '64px' : '56px' }}
        aria-hidden="true"
      />

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} pathname={pathname} />

      {/* Floating Control Panel - now positioned independently outside the navbar */}
      <FloatingControlPanel />
    </>
  );
}
