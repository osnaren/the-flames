'use client';

import Logo from '@components/ui/Logo';
import { FOOTER_CONFIG } from '@config/navigation';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { ArrowUp, BookOpen, ExternalLink, Flame, Heart, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, type ReactNode } from 'react';
import ProductHuntBadge from '../ProductHuntBadge';
import type { IconComponent } from './types';

const linkClass =
  'group text-on-surface-variant hover:text-on-surface focus-visible:ring-primary/40 inline-flex items-center gap-2 rounded-md py-1 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none';

function Underline({ children }: { children: ReactNode }) {
  return (
    <span className="relative">
      {children}
      <span
        aria-hidden="true"
        className="from-primary to-secondary absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-linear-to-r transition-transform duration-300 group-hover:scale-x-100"
      />
    </span>
  );
}

function FooterHeading({ id, icon: Icon, children }: { id: string; icon: IconComponent; children: ReactNode }) {
  return (
    <h2 id={id} className="text-on-surface mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
      <Icon className="text-primary h-4 w-4" aria-hidden="true" />
      {children}
    </h2>
  );
}

/**
 * Site footer: a call-to-action band, link columns and the legal bar.
 * Static by design — only hover/focus feedback (CSS) and one compositor-driven
 * idle animation, so it costs nothing while the user scrolls.
 */
function Footer() {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const pathname = usePathname();
  const onHome = pathname === '/';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

  return (
    <footer className="border-outline-variant/40 relative mt-auto overflow-hidden border-t" role="contentinfo">
      {/* Soft backdrop */}
      <div
        aria-hidden="true"
        className="from-surface-container-lowest/90 via-surface/60 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(56rem,140vw)] -translate-x-1/2 rounded-full"
        style={{ backgroundImage: 'radial-gradient(ellipse, rgb(249 115 22 / 0.12), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-14">
        {/* Call to action */}
        <div className="border-outline-variant/40 bg-surface-container-low/70 mb-12 flex flex-col items-center justify-between gap-5 rounded-3xl border p-6 text-center shadow-sm sm:flex-row sm:p-7 sm:text-left">
          <div>
            <p className="font-heading text-on-surface text-xl font-bold sm:text-2xl">
              {onHome ? 'One more pair? ' : 'Got two names in mind? '}
              <span
                className={`inline-block ${shouldAnimate ? 'motion-wiggle' : ''}`}
                style={{ ['--wiggle-duration' as string]: '4s' }}
                aria-hidden="true"
              >
                🔥
              </span>
            </p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Cancel the common letters, count around F-L-A-M-E-S, and see where you land.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
            {onHome ? (
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 via-rose-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Play again
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 via-rose-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Play FLAMES
              </Link>
            )}
            <Link
              href="/manual"
              className="border-outline-variant/60 text-on-surface hover:bg-surface-container-high inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Try manual mode
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <Logo variant="animated" animationType="onHover" />
            <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed">
              {FOOTER_CONFIG.brand.description} The classic notebook name game, reimagined for the browser.
            </p>
            <div className="flex items-center gap-1">
              {FOOTER_CONFIG.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5 ${social.hoverColor}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <ProductHuntBadge />
          </div>

          {/* Play */}
          <nav aria-labelledby="footer-play-heading">
            <FooterHeading id="footer-play-heading" icon={Sparkles}>
              Play
            </FooterHeading>
            <ul className="space-y-2">
              {FOOTER_CONFIG.navigation.primary.map((link) => (
                <li key={link.to}>
                  <Link href={link.to} className={linkClass} title={link.description}>
                    <Underline>{link.label}</Underline>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Project */}
          <nav aria-labelledby="footer-project-heading">
            <FooterHeading id="footer-project-heading" icon={BookOpen}>
              Project
            </FooterHeading>
            <ul className="space-y-2">
              {FOOTER_CONFIG.navigation.secondary.map((link) => (
                <li key={link.to}>
                  <Link href={link.to} className={linkClass}>
                    <Underline>{link.label}</Underline>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-labelledby="footer-resources-heading" className="col-span-2 sm:col-span-1">
            <FooterHeading id="footer-resources-heading" icon={ExternalLink}>
              Resources
            </FooterHeading>
            <ul className="space-y-2">
              {FOOTER_CONFIG.external.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    title={link.description}
                  >
                    <link.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    <Underline>{link.label}</Underline>
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-outline-variant/40 mt-12 flex flex-col items-center gap-4 border-t pt-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="space-y-1">
            <p className="text-on-surface-variant text-sm">
              © {FOOTER_CONFIG.brand.year} {FOOTER_CONFIG.brand.name}. All rights reserved.
            </p>
            <p className="text-on-surface-variant/70 text-xs">
              {FOOTER_CONFIG.disclaimer.text} {FOOTER_CONFIG.disclaimer.note}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-on-surface-variant flex items-center gap-1.5 text-sm">
              Made with
              <Heart
                className={`text-error h-4 w-4 fill-current ${shouldAnimate ? 'motion-pulse' : ''}`}
                style={{ ['--pulse-scale' as string]: '1.2', ['--pulse-duration' as string]: '1.4s' }}
                aria-hidden="true"
              />
              <span className="sr-only">love</span>
              for love calculations
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high inline-flex h-9 w-9 items-center justify-center rounded-full border transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
