import { useRef, useEffect, useState, useCallback, memo } from 'react';
import confetti from 'canvas-confetti';
import { FlamesResult } from '../../../features/flamesGame/flames.types';
import { getResultVisuals } from '../../../features/flamesGame/resultVisuals';

interface ConfettiEffectProps {
  result: FlamesResult;
  isActive: boolean;
  animationsEnabled: boolean;
}

/**
 * Component that generates confetti animations based on the FLAMES result
 * Memoized to prevent unnecessary re-renders
 */
function ConfettiEffect({ 
  result, 
  isActive, 
  animationsEnabled 
}: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  
  // Create confetti instances for left and right cannons
  const leftCannonRef = useRef<confetti.CreateTypes | null>(null);
  const rightCannonRef = useRef<confetti.CreateTypes | null>(null);
  
  // Check device capabilities and user preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Detect if likely a low-end device
    setIsLowEndDevice(
      // Check for CPU cores or low memory devices
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      // Check if it's a mobile device
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
    
    // Update if preference changes
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  // Should we enable animations based on both user settings and system preferences
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;
  
  // Create confetti cannons when component mounts
  useEffect(() => {
    if (!canvasRef.current || !shouldAnimate) return;
    
    const myCanvas = canvasRef.current;
    
    // Set initial canvas size
    const updateCanvasSize = () => {
      myCanvas.width = window.innerWidth;
      myCanvas.height = window.innerHeight;
    };
    updateCanvasSize();
    
    // Listen for window resize to update canvas dimensions
    window.addEventListener('resize', updateCanvasSize);
    
    // Only create new instances if they don't exist
    if (!leftCannonRef.current) {
      leftCannonRef.current = confetti.create(myCanvas, {
        useWorker: true
      });
    }
    
    if (!rightCannonRef.current) {
      rightCannonRef.current = confetti.create(myCanvas, {
        useWorker: true
      });
    }
    
    return () => {
      // Cleanup
      window.removeEventListener('resize', updateCanvasSize);
      if (leftCannonRef.current) {
        leftCannonRef.current.reset();
      }
      if (rightCannonRef.current) {
        rightCannonRef.current.reset();
      }
    };
  }, [shouldAnimate]);
  
  // Fire confetti from a side cannon
  const fireSideCannon = useCallback((cannon: confetti.CreateTypes | null, origin: { x: number, y: number }, angle: number) => {
    if (!cannon || !result) return;
    
    const visualConfig = getResultVisuals(result);
    const particleCount = isLowEndDevice ? Math.floor(visualConfig.particleCount * 0.6) : visualConfig.particleCount;
    
    // Fire colored confetti
    cannon({
      particleCount: particleCount,
      angle: angle,
      spread: visualConfig.confetti.spread,
      origin: origin,
      colors: visualConfig.confetti.colors,
      ticks: isLowEndDevice ? 150 : 200,
      gravity: 1,
      scalar: visualConfig.confetti.strength,
      drift: 0.2,
      shapes: ['circle', 'square']
    });
    
    // Fire emoji confetti with slight delay
    if (!isLowEndDevice) {
      setTimeout(() => {
        // For emoji confetti, we'll use a custom draw function
        const customConfettiOptions = {
          particleCount: Math.floor(particleCount * 0.2),
          angle: angle,
          spread: visualConfig.confetti.spread * 0.8,
          origin: origin,
          ticks: 150,
          gravity: 0.8,
          scalar: visualConfig.confetti.strength * 1.2,
          drift: 0.1,
          shapes: ['circle'],
          // Use custom draw function for emojis
          customShape: (ctx: CanvasRenderingContext2D) => {
            const emoji = visualConfig.confetti.emojis[Math.floor(Math.random() * visualConfig.confetti.emojis.length)];
            ctx.font = '18px serif';
            ctx.fillText(emoji, 0, 0);
          }
        };
        // Cast to any to bypass typing limitations in the library
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cannon(customConfettiOptions as any);
      }, 200);
    }
  }, [result, isLowEndDevice]);
  
  // Trigger confetti when result changes or becomes active
  useEffect(() => {
    if (!leftCannonRef.current || !rightCannonRef.current || !isActive || !result || !shouldAnimate) return;
    
    // Prevent firing confetti for null result
    if (result === null) return;
    
    // Fire left cannon
    fireSideCannon(leftCannonRef.current, { x: 0.1, y: 0.5 }, 60);
    
    // Fire right cannon with slight delay
    setTimeout(() => {
      fireSideCannon(rightCannonRef.current, { x: 0.9, y: 0.5 }, 120);
    }, 100);
    
  }, [result, isActive, shouldAnimate, fireSideCannon]);
  
  if (!shouldAnimate) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ConfettiEffect);