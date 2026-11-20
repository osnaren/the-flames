/**
 * Lightweight haptics that work across platforms.
 *
 * - Android / Chromium: the Vibration API with short, crisp pulses.
 * - iOS Safari (18+): no Vibration API, but toggling a native `<input switch>`
 *   inside a user gesture plays the system "selection" haptic. A hidden switch
 *   is created once and toggled through its label.
 */

let iosSwitchLabel: HTMLLabelElement | null = null;

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function getIOSSwitch() {
  if (iosSwitchLabel || typeof document === 'undefined') return iosSwitchLabel;
  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText =
    'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;left:-9999px;top:0';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.tabIndex = -1;
  label.appendChild(input);
  document.body.appendChild(label);
  iosSwitchLabel = label;
  return label;
}

export function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** Short selection tick for taps on controls. Must run inside a user gesture on iOS. */
export function hapticTick(ms = 8) {
  try {
    if (canVibrate()) {
      navigator.vibrate(ms);
      return;
    }
    if (isIOS()) getIOSSwitch()?.click();
  } catch {
    // Haptics are a nicety; never let them throw.
  }
}

/** Patterned vibration (Android); iOS falls back to a single tick. */
export function hapticPattern(pattern: number | number[]) {
  try {
    if (canVibrate()) {
      navigator.vibrate(pattern);
      return;
    }
    if (isIOS()) getIOSSwitch()?.click();
  } catch {
    // Ignore.
  }
}
