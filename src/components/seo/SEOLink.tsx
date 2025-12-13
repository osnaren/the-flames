'use client';

import Link from 'next/link';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

interface SEOLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  /** Add nofollow for untrusted links */
  noFollow?: boolean;
  /** Add noopener for security */
  external?: boolean;
  /** Description for title attribute */
  description?: string;
}

/**
 * SEO-optimized Link Component
 * Automatically handles external links, rel attributes, and accessibility
 */
export const SEOLink = forwardRef<HTMLAnchorElement, SEOLinkProps>(
  ({ href, children, noFollow, external, description, target, rel, ...props }, ref) => {
    // Determine if the link is external
    const isExternal = external || (typeof href === 'string' && (href.startsWith('http') || href.startsWith('//')));

    // Build rel attribute
    const relValue =
      [rel, noFollow && 'nofollow', isExternal && 'noopener', isExternal && 'noreferrer'].filter(Boolean).join(' ') ||
      undefined;

    // Target for external links
    const targetValue = target || (isExternal ? '_blank' : undefined);

    return (
      <Link ref={ref} href={href} target={targetValue} rel={relValue} title={description} {...props}>
        {children}
      </Link>
    );
  }
);

SEOLink.displayName = 'SEOLink';

export default SEOLink;
