'use client';

import Logo from '@components/ui/Logo';
import { NAVBAR_CONFIG } from '@config/navigation';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import FloatingControlPanel from '@layout/FloatingControlPanel';
import { LayoutGroup, motion, useScroll, useSpring } from 'framer-motion';
import { Flame, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import NavItem from './NavItem';

// Lazy load MobileMenu since it's not needed on initial render
const MobileMenu = dynamic(() => import('./MobileMenu'), {
  ssr: false,
  loading: () => null,
});

/**
 * Site header.
 *
 * Scroll state is read in a single rAF-throttled listener and expressed with
 * CSS transitions (transform/opacity/background), so scrolling never runs
 * per-frame React work. The reading-progress bar is a framer motion value that
 * writes `transform` directly without re-rendering.
 */
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const lastScrollTop = useRef(0);
  const previousPath = useRef(pathname);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const top = window.scrollY;
      setIsScrolled(top > 12);
      // Auto-hide on small screens while reading downwards; reveal on any upward scroll.
      if (window.innerWidth < 768) {
        const delta = top - lastScrollTop.current;
        if (top < 80 || delta < -6) setIsHidden(false);
        else if (delta > 6) setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollTop.current = top;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Let other fixed chrome (the floating settings button) follow the header.
  useEffect(() => {
    document.documentElement.dataset.navHidden = isHidden && !isMobileMenuOpen ? 'true' : 'false';
  }, [isHidden, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Scroll to top on client-side navigation (not on first load or hash changes).
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setIsHidden(false);
  }, [pathname, prefersReducedMotion]);

  const navItems = NAVBAR_CONFIG.items.filter((item) => !item.mobileOnly);
  const onHome = pathname === '/';

  return (
    <>
      <header
        className="fixed top-0 right-0 left-0 z-30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: isHidden && !isMobileMenuOpen ? 'translateY(-100%)' : 'none' }}
        role="banner"
      >
        {/* Surface: solid-ish on phones (cheap), frosted glass from md up */}
        <div
          aria-hidden="true"
          className={`border-outline-variant/40 absolute inset-0 border-b transition-[opacity,box-shadow] duration-300 md:backdrop-blur-xl ${
            isScrolled
              ? 'bg-surface/95 md:bg-surface/80 opacity-100 shadow-[0_6px_24px_-12px_rgb(0_0_0/0.35)]'
              : 'bg-surface/80 md:bg-surface/40 border-transparent opacity-100'
          }`}
        />

        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16">
          <Logo variant="animated" animationType="onHover" />

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <LayoutGroup id="main-nav">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  to={item.path}
                  isActive={pathname === item.path}
                />
              ))}
            </LayoutGroup>
            {!onHome && (
              <Link
                href="/"
                className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-pink-500 via-rose-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/30 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Play now
              </Link>
            )}
          </nav>

          {/* Mobile menu button (leaves room for the floating settings button) */}
          <button
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high active:bg-surface-container-highest rounded-xl p-2.5 transition-colors duration-200 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Reading progress */}
        {shouldAnimate && (
          <motion.div
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 h-0.5 origin-left bg-linear-to-r from-pink-500 via-orange-400 to-amber-300 transition-opacity duration-300"
            style={{ scaleX: progress, opacity: isScrolled ? 0.9 : 0 }}
          />
        )}
      </header>

      {/* Space filler with fixed height to prevent CLS */}
      <div className="h-14 md:h-16" aria-hidden="true" />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} pathname={pathname || ''} />

      <FloatingControlPanel />
    </>
  );
}

export default memo(Navbar);
