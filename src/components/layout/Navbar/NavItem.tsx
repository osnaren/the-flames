'use client';

import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

interface NavItemProps {
  icon?: LucideIcon;
  label: string;
  to?: string;
  isActive?: boolean;
  onClick?: () => void;
  mobileOnly?: boolean;
  className?: string;
}

/**
 * Navigation link. The active background is a shared-layout pill, so moving
 * between pages slides it from the previous item instead of popping it in.
 * Hover feedback is plain CSS.
 */
function NavItem({
  icon: Icon,
  label,
  to,
  isActive = false,
  onClick,
  mobileOnly = false,
  className = '',
}: NavItemProps) {
  const { shouldAnimate } = useAnimationPreferences();

  const classes = `group relative flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200
    focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none
    ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}
    ${mobileOnly ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {/* Hover wash */}
      {!isActive && (
        <span
          aria-hidden="true"
          className="bg-surface-container-high/70 absolute inset-0 scale-90 rounded-xl opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100"
        />
      )}

      {/* Active pill */}
      {isActive && (
        <motion.span
          aria-hidden="true"
          layoutId={mobileOnly ? undefined : 'nav-active-pill'}
          className="bg-primary-container/20 ring-primary/25 absolute inset-0 rounded-xl ring-1"
          transition={shouldAnimate ? { type: 'spring', stiffness: 420, damping: 34 } : { duration: 0 }}
        />
      )}

      <span className="relative z-10 flex items-center">
        {Icon && (
          <Icon
            className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            aria-hidden="true"
          />
        )}
        {label}
      </span>
    </>
  );

  if (to) {
    return (
      <Link href={to} className={classes} aria-current={isActive ? 'page' : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-current={isActive ? 'page' : undefined}>
      {content}
    </button>
  );
}

export default memo(NavItem);
