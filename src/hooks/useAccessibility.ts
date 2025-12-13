import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook for managing focus within a container (focus trap)
 * Useful for modals, drawers, and dialogs
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (isActive) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;

      // Focus the container or first focusable element
      if (containerRef.current) {
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    } else {
      // Restore focus when trap is deactivated
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }
  }, [isActive]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isActive]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return containerRef;
}

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create the announcer element if it doesn't exist
    let announcer = document.getElementById('sr-announcer') as HTMLDivElement | null;

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(announcer);
    }

    announcerRef.current = announcer;

    return () => {
      // Clean up announcer on unmount if no other components are using it
      const existingAnnouncer = document.getElementById('sr-announcer');
      if (existingAnnouncer && !document.querySelector('[data-uses-announcer]')) {
        existingAnnouncer.remove();
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = '';
      // Use setTimeout to ensure the change is announced
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message;
        }
      }, 100);
    }
  }, []);

  return announce;
}

/**
 * Hook for managing skip link focus
 */
export function useSkipLink(targetId: string = 'main-content') {
  const handleSkip = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  }, [targetId]);

  return handleSkip;
}

/**
 * Hook for roving tabindex navigation (useful for toolbars, tab lists, etc.)
 */
export function useRovingTabIndex<T extends HTMLElement>(
  items: T[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
  } = {}
) {
  const { orientation = 'horizontal', loop = true } = options;
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      const itemCount = items.length;
      let nextIndex = currentIndexRef.current;

      const shouldHandle =
        (orientation === 'horizontal' && (key === 'ArrowLeft' || key === 'ArrowRight')) ||
        (orientation === 'vertical' && (key === 'ArrowUp' || key === 'ArrowDown')) ||
        (orientation === 'both' && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) ||
        key === 'Home' ||
        key === 'End';

      if (!shouldHandle) return;

      event.preventDefault();

      switch (key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = loop
            ? (currentIndexRef.current + 1) % itemCount
            : Math.min(currentIndexRef.current + 1, itemCount - 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = loop
            ? (currentIndexRef.current - 1 + itemCount) % itemCount
            : Math.max(currentIndexRef.current - 1, 0);
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = itemCount - 1;
          break;
      }

      if (nextIndex !== currentIndexRef.current) {
        // Update tabindex
        items[currentIndexRef.current]?.setAttribute('tabindex', '-1');
        items[nextIndex]?.setAttribute('tabindex', '0');
        items[nextIndex]?.focus();
        currentIndexRef.current = nextIndex;
      }
    },
    [items, orientation, loop]
  );

  useEffect(() => {
    // Initialize tabindex
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
  }, [items]);

  return { handleKeyDown };
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): Element[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
    'details>summary:first-of-type',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1'
  );
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const { ctrl = false, alt = false, shift = false, meta = false, preventDefault = true } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.altKey === alt &&
        event.shiftKey === shift &&
        event.metaKey === meta
      ) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrl, alt, shift, meta, preventDefault]);
}

export default {
  useFocusTrap,
  useAnnouncer,
  useSkipLink,
  useRovingTabIndex,
  useKeyboardShortcut,
};
