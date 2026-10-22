import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useDeviceType } from '@/hooks/useDeviceType';
import { fireResultConfetti, resetResultConfetti } from '@/lib/result-confetti';
import { FlamesResult, getResultData } from '@/utils/resultData';
import confetti from 'canvas-confetti';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

interface ConfettiEffectProps {
  result: FlamesResult;
  isActive: boolean;
}

interface CannonPosition {
  name: string;
  origin: { x: number; y: number };
  angle: number;
}

/**
 * Component that generates confetti animations based on the FLAMES result
 * Memoized to prevent unnecessary re-renders
 */
function ConfettiEffect({ result, isActive }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect low-end device on mount (client-side only)
  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const isLowEnd =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsLowEndDevice(isLowEnd);
  }, []);

  // Use our custom hooks
  const deviceType = useDeviceType();
  const { shouldAnimate } = useAnimationPreferences();

  // Store a single confetti instance instead of multiple ones
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const clearPendingBursts = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);
  const scheduleBurst = useCallback((run: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      run();
    }, delay);
    timersRef.current.add(timer);
  }, []);

  // Define cannon positions based on device type
  const cannonPositions = useCallback((): CannonPosition[] => {
    switch (deviceType) {
      case 'desktop':
        return [
          { name: 'left', origin: { x: 0.1, y: 0.5 }, angle: 60 },
          { name: 'right', origin: { x: 0.9, y: 0.5 }, angle: 120 },
          { name: 'leftTop', origin: { x: 0.2, y: 0.1 }, angle: 80 },
          { name: 'rightTop', origin: { x: 0.8, y: 0.1 }, angle: 100 },
        ];
      case 'tablet':
        return [
          { name: 'left', origin: { x: 0.1, y: 0.5 }, angle: 60 },
          { name: 'right', origin: { x: 0.9, y: 0.5 }, angle: 120 },
        ];
      case 'mobile':
      default:
        return [
          { name: 'left', origin: { x: 0.1, y: 0.5 }, angle: 60 },
          { name: 'right', origin: { x: 0.9, y: 0.5 }, angle: 120 },
        ];
    }
  }, [deviceType]);

  // Create confetti instance when component mounts
  useEffect(() => {
    if (!canvasRef.current || !shouldAnimate) return;

    const myCanvas = canvasRef.current;

    // Size before transferring ownership to the worker. Its resize fallback
    // cannot measure an OffscreenCanvas when a hidden DOM canvas reports 0x0.
    myCanvas.width = Math.max(1, window.innerWidth);
    myCanvas.height = Math.max(1, window.innerHeight);

    // Create only one confetti instance
    if (!confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(myCanvas, {
        useWorker: true,
        resize: false,
        disableForReducedMotion: true,
      });
    }

    return () => {
      // Cleanup
      clearPendingBursts();
      if (confettiInstanceRef.current) {
        resetResultConfetti(confettiInstanceRef.current);
        confettiInstanceRef.current = null;
      }
    };
  }, [shouldAnimate, clearPendingBursts]);

  // Fire confetti from a position
  const fireConfetti = useCallback(
    (origin: { x: number; y: number }, angle: number, delay: number = 0) => {
      if (!confettiInstanceRef.current || !result) return;

      scheduleBurst(() => {
        const visualConfig = getResultData(result);
        const particleCount = isLowEndDevice
          ? Math.floor(visualConfig.particleCount * 0.6)
          : visualConfig.particleCount;

        const confettiInstance = confettiInstanceRef.current;
        if (!confettiInstance) return;

        // Launch standard confetti particles in colors from the theme
        void fireResultConfetti(confettiInstance, {
          particleCount: Math.floor(particleCount * 0.7),
          angle: angle,
          spread: visualConfig.confetti.spread,
          origin: origin,
          colors: visualConfig.confetti.colors,
          ticks: isLowEndDevice ? 150 : 200,
          gravity: 1,
          scalar: visualConfig.confetti.strength,
          drift: 0.2,
          shapes: ['circle', 'square'],
        });

        // Built-in shapes do not send ImageBitmaps through WebKit's worker
        // bridge, which can throw TypeError during structured cloning.
        scheduleBurst(() => {
          if (confettiInstanceRef.current !== confettiInstance) return;

          const secondaryOptions: confetti.Options = {
            particleCount: Math.floor(particleCount * 0.3),
            angle: angle,
            spread: visualConfig.confetti.spread * 0.8,
            origin: origin,
            ticks: isLowEndDevice ? 120 : 180,
            gravity: 0.8,
            scalar: visualConfig.confetti.strength * 1.2,
            drift: 0.1,
            shapes: ['star', 'circle'],
            colors: visualConfig.confetti.colors,
          };
          void fireResultConfetti(confettiInstance, secondaryOptions);
        }, 150);
      }, delay);
    },
    [result, isLowEndDevice, scheduleBurst]
  );

  // Trigger confetti when result changes or becomes active
  useEffect(() => {
    if (!isActive || !result || !shouldAnimate) return;

    // Get the positions for the current device type
    const positions = cannonPositions();

    // Fire confetti from different positions with delays
    positions.forEach((pos, index) => {
      fireConfetti(pos.origin, pos.angle, index * 150);
    });
    return clearPendingBursts;
  }, [result, isActive, shouldAnimate, fireConfetti, cannonPositions, clearPendingBursts]);

  if (!shouldAnimate) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-60"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ConfettiEffect);
