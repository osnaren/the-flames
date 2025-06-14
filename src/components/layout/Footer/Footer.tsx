import Logo from '@components/ui/Logo';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOOTER_CONFIG } from './config';
import type { FooterLinkProps } from './types';

export default function Footer() {
  const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();
  const { scrollYProgress } = useScroll();

  // Enhanced scroll-based effects
  const footerOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };

  // Enhanced footer link component
  const FooterLink = ({
    to,
    href,
    external = false,
    children,
    icon: Icon,
    description,
    className = '',
    ...props
  }: FooterLinkProps) => {
    const linkClass = `
      group relative inline-flex items-center gap-2 text-on-surface-variant 
      hover:text-primary transition-all duration-300 text-sm
      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 
      focus:ring-offset-surface rounded-md px-1 py-0.5
      ${className}
    `;

    const content = (
      <>
        {Icon && <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />}
        <span className="relative">
          {children}
          {/* Animated underline */}
          <motion.span
            className="from-primary to-secondary absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </span>
        {external && <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />}
      </>
    );

    if (to) {
      return (
        <Link to={to} className={linkClass} title={description} {...props}>
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={linkClass}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        title={description}
        {...props}
      >
        {content}
      </a>
    );
  };

  return (
    <motion.footer
      style={{
        opacity: prefersReducedMotion ? 1 : footerOpacity,
        y: prefersReducedMotion ? 0 : footerY,
      }}
      className="border-outline/10 from-surface-container-lowest/80 via-surface/50 relative mt-auto overflow-hidden border-t bg-gradient-to-t to-transparent"
      role="contentinfo"
    >
      {/* Enhanced background elements */}
      {shouldAnimate && (
        <>
          {/* Subtle gradient overlay */}
          <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

          {/* Floating particles effect */}
          <motion.div
            className="bg-primary/30 absolute top-4 right-1/4 h-2 w-2 rounded-full blur-sm"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-secondary/40 absolute top-8 left-1/3 h-1.5 w-1.5 rounded-full blur-sm"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Logo variant="animated" animationType="onHover" className="mb-4" />
              </motion.div>

              <p className="text-on-surface-variant text-sm leading-relaxed">{FOOTER_CONFIG.brand.description}</p>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {FOOTER_CONFIG.social.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors ${social.hoverColor}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="text-on-surface mb-4 flex items-center gap-2 font-semibold">
              <Sparkles className="text-primary h-4 w-4" />
              Navigation
            </h3>
            <nav className="space-y-3">
              {FOOTER_CONFIG.navigation.primary.map((link) => (
                <div key={link.to}>
                  <FooterLink to={link.to} description={link.description}>
                    {link.label}
                  </FooterLink>
                </div>
              ))}
              <div className="border-outline/10 mt-4 border-t pt-2">
                {FOOTER_CONFIG.navigation.secondary.map((link) => (
                  <div key={link.to} className="mb-2">
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </div>
                ))}
              </div>
            </nav>
          </motion.div>

          {/* Resources Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="text-on-surface mb-4 flex items-center gap-2 font-semibold">
              <ExternalLink className="text-primary h-4 w-4" />
              Resources
            </h3>
            <nav className="space-y-3">
              {FOOTER_CONFIG.external.map((link) => (
                <div key={link.href}>
                  <FooterLink href={link.href} external={true} icon={link.icon} description={link.description}>
                    {link.label}
                  </FooterLink>
                </div>
              ))}
            </nav>
          </motion.div>

          {/* Stats Section */}
          {FOOTER_CONFIG.showStats && (
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h3 className="text-on-surface mb-4 flex items-center gap-2 font-semibold">
                <TrendingUp className="text-primary h-4 w-4" />
                Our Impact
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {FOOTER_CONFIG.stats.map((stat, _index) => (
                  <motion.div
                    key={stat.label}
                    variants={statsVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-surface-container-low/50 border-outline/10 group hover:border-primary/20 rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex flex-col items-center text-center">
                      <stat.icon className="text-primary mb-1 h-5 w-5 transition-transform group-hover:scale-110" />
                      <div className="text-on-surface text-sm font-bold">{stat.value}</div>
                      <div className="text-on-surface-variant text-xs leading-tight">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Section */}
        <motion.div variants={itemVariants} className="border-outline/10 mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <div className="text-on-surface-variant text-sm">
              © {FOOTER_CONFIG.brand.year} {FOOTER_CONFIG.brand.name}. All rights reserved.
            </div>

            {/* Location Badge */}
            <motion.div
              className="text-on-surface-variant flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <span>Made with</span>
              <motion.div
                animate={
                  shouldAnimate
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Heart className="text-error h-4 w-4 fill-current drop-shadow-sm" />
              </motion.div>
              <span>at OSLabs 🇮🇳</span>
            </motion.div>
          </div>

          {/* Enhanced Disclaimer */}
          <motion.div
            className="mt-6 space-y-2 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-on-surface-variant/80 text-xs italic">{FOOTER_CONFIG.disclaimer.text}</p>
            <p className="text-on-surface-variant/60 text-xs">{FOOTER_CONFIG.disclaimer.note}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative bottom accent */}
      {shouldAnimate && (
        <motion.div
          className="from-primary via-secondary to-tertiary absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r opacity-60"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          viewport={{ once: true }}
        />
      )}
    </motion.footer>
  );
}
