import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useDeviceType } from '@/hooks/useDeviceType';
import { FlamesResult } from '@features/flamesGame/flames.types';
import { getResultVisuals } from '@features/flamesGame/resultVisuals';
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

  // Use our custom hooks
  const deviceType = useDeviceType();
  const { shouldAnimate } = useAnimationPreferences();

  // Store a single confetti instance instead of multiple ones
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);

  // Check device capabilities
  useEffect(() => {
    // Detect if likely a low-end device
    setIsLowEndDevice(
      // Check for CPU cores or low memory devices
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        // Check if it's a mobile device
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
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

    // Set initial canvas size
    const updateCanvasSize = () => {
      if (!confettiInstanceRef.current) {
        myCanvas.width = window.innerWidth;
        myCanvas.height = window.innerHeight;
      }
    };
    updateCanvasSize();

    // Listen for window resize to update canvas dimensions
    window.addEventListener('resize', updateCanvasSize);

    // Create only one confetti instance
    if (!confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(myCanvas, {
        useWorker: true,
        resize: true,
      });
    }

    return () => {
      // Cleanup
      window.removeEventListener('resize', updateCanvasSize);
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    };
  }, [shouldAnimate]);

  // Fire confetti from a position
  const fireConfetti = useCallback(
    (origin: { x: number; y: number }, angle: number, delay: number = 0) => {
      if (!confettiInstanceRef.current || !result) return;

      setTimeout(() => {
        const visualConfig = getResultVisuals(result);
        const particleCount = isLowEndDevice
          ? Math.floor(visualConfig.particleCount * 0.6)
          : visualConfig.particleCount;

        const confettiInstance = confettiInstanceRef.current;
        if (!confettiInstance) return;

        // Launch standard confetti particles in colors from the theme
        confettiInstance({
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

        // Launch emoji confetti using shapeFromText
        setTimeout(() => {
          if (!confettiInstance) return;

          // Create emoji shapes that can be passed to the worker
          const emojiShapes = visualConfig.confetti.emojis.map((emoji) =>
            confetti.shapeFromText({ text: emoji, scalar: visualConfig.confetti.strength * 1.2 })
          );

          const emojiOptions = {
            particleCount: Math.floor(particleCount * 0.3),
            angle: angle,
            spread: visualConfig.confetti.spread * 0.8,
            origin: origin,
            ticks: isLowEndDevice ? 120 : 180,
            gravity: 0.8,
            scalar: visualConfig.confetti.strength * 1.2, // Scalar is now part of shapeFromText
            drift: 0.1,
            shapes: emojiShapes, // Use the generated emoji shapes
            colors: visualConfig.confetti.colors, // Emojis have their own colors, but specify base colors
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          confettiInstance(emojiOptions as any);
        }, 150);
      }, delay);
    },
    [result, isLowEndDevice]
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
  }, [result, isActive, shouldAnimate, fireConfetti, cannonPositions]);

  if (!shouldAnimate) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ConfettiEffect);
