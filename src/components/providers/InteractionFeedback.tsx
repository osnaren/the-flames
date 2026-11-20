'use client';

import { useSoundSystem } from '@/hooks/useSoundSystem';
import { hapticTick } from '@/lib/haptics';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useEffect } from 'react';

const INTERACTIVE = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="option"]',
  '[role="menuitem"]',
  'summary',
  'select',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="range"]',
].join(',');

/**
 * Site-wide tactile and audible feedback, applied once through event
 * delegation instead of wiring every button by hand.
 *
 * - Touch taps on any control give a short haptic tick (respects the haptics toggle).
 * - Navigation links and tabs, which have no sound of their own, play a soft click.
 *   Controls that manage their own sounds can opt out with `data-sfx="off"`;
 *   `data-haptic="off"` opts out of the tick.
 */
export default function InteractionFeedback() {
  const { playSound } = useSoundSystem();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      const target = (event.target as Element | null)?.closest?.(INTERACTIVE);
      if (!target || target.closest('[data-haptic="off"]')) return;
      if (!usePreferencesStore.getState().isHapticEnabled) return;
      // Android fires immediately on pointerdown for a crisp feel.
      if (typeof navigator.vibrate === 'function') hapticTick(8);
    };

    const handleClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest?.(INTERACTIVE);
      if (!target) return;
      const prefs = usePreferencesStore.getState();

      // iOS has no Vibration API; its switch-haptic must run inside the click.
      if (
        prefs.isHapticEnabled &&
        typeof navigator.vibrate !== 'function' &&
        !target.closest('[data-haptic="off"]') &&
        (event as PointerEvent).pointerType !== 'mouse'
      ) {
        hapticTick();
      }

      if (!prefs.isSoundEnabled || target.closest('[data-sfx="off"]')) return;
      const isNavLink = target.matches('a[href]') && !target.getAttribute('href')?.startsWith('#');
      const isTab = target.getAttribute('role') === 'tab';
      if (isNavLink || isTab) void playSound('click', { volume: 0.5 });
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });
    document.addEventListener('click', handleClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [playSound]);

  return null;
}
