import { cn } from '@/utils';
import { useDeviceType } from '@hooks/useDeviceType';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CanvasExperienceProps } from '../types';
import CanvasInstructions from './CanvasInstructions';
import CanvasTools from './CanvasTools';

// Enhanced custom cursor system with theme support
const getCursorConfig = () => ({
  draw: {
    dark: 'url(/assets/chalk.png) 15 12, auto',
    light: 'url(/assets/pen.png) 6 60, auto',
  },
  eraser: {
    dark: 'url(/assets/duster.png) 30 32, auto',
    light: 'url(/assets/eraser.png) 10 42, auto',
  },
});

// Utility to get proper viewport height for mobile
const getViewportHeight = () => {
  // Use window.innerHeight on mobile for better handling of address bar
  if (typeof window !== 'undefined') {
    return window.innerHeight;
  }
  return 600; // Fallback for SSR
};

export default function CanvasExperience({ name1, name2, onBack }: CanvasExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const lastCoordinates = useRef({ x: 0, y: 0 });

  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  // Local state for drawing logic
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState('600px');
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Calculate responsive canvas height with mobile viewport fixes
  useEffect(() => {
    const calculateCanvasHeight = () => {
      const vh = getViewportHeight();

      if (isMobile) {
        // Mobile - account for UI elements and floating tools
        return `${Math.min(vh * 0.6, 500)}px`;
      } else if (isTablet) {
        // Tablet
        return `${Math.min(vh * 0.7, 600)}px`;
      } else {
        // Desktop - bigger canvas for better scribbling
        return `${Math.min(vh * 0.75, 1024)}px`;
      }
    };

    const updateHeight = () => {
      setCanvasHeight(calculateCanvasHeight());
    };

    updateHeight();

    // Handle both resize and orientation change
    const handleResize = () => {
      setTimeout(updateHeight, 100); // Delay to ensure proper measurement
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile, isTablet]);

  // Calculate letter positions for proper layout with mobile scaling
  const getScaleFactor = () => {
    if (isMobile) return 0.8; // Scale down on mobile
    if (isTablet) return 0.85; // Slightly smaller on tablet
    return 1; // Full size on desktop
  };

  const scaleFactor = getScaleFactor();

  const name1Letters = name1
    .toUpperCase()
    .split('')
    .map((letter, index) => ({
      letter,
      id: `name1-${index}`,
      nameIndex: 1 as const,
    }));

  const name2Letters = name2
    .toUpperCase()
    .split('')
    .map((letter, index) => ({
      letter,
      id: `name2-${index}`,
      nameIndex: 2 as const,
    }));

  const flamesLetters = [
    { letter: 'F', meaning: 'Friends', icon: '🤝🏼', color: 'friendship' },
    { letter: 'L', meaning: 'Love', icon: '💕', color: 'love' },
    { letter: 'A', meaning: 'Affection', icon: '🥰', color: 'affection' },
    { letter: 'M', meaning: 'Marriage', icon: '💍', color: 'marriage' },
    { letter: 'E', meaning: 'Enemies', icon: '⚔️', color: 'enemy' },
    { letter: 'S', meaning: 'Siblings', icon: '👫🏼', color: 'siblings' },
  ].map((flame, index) => ({
    ...flame,
    id: `flames-${index}`,
  }));

  // Enhanced drawing function with performance optimizations
  const drawWithEffect = useCallback(
    (xI: number, yI: number, ctx: CanvasRenderingContext2D) => {
      ctx.save();

      const x = xI;
      const y = yI;
      const isDarkMode = document.documentElement.classList.contains('dark');

      // Adjust drawing properties for different devices and themes
      if (isDarkMode) {
        const opacity = 0.7 + Math.random() * 0.3;
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = isMobile ? 3 : 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else {
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = isMobile ? 2.5 : 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      const lastX = lastCoordinates.current.x;
      const lastY = lastCoordinates.current.y;

      if (!lastX && !lastY) {
        lastCoordinates.current = { x, y };
        ctx.restore();
        return;
      }

      // Draw the main line
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Add texture effects for dark theme (reduced on mobile for performance)
      if (isDarkMode && !isMobile) {
        const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
        const length = Math.max(5, Math.round(distance));

        if (distance > 2) {
          const xUnit = (x - lastX) / (length || 1);
          const yUnit = (y - lastY) / (length || 1);

          ctx.globalCompositeOperation = 'destination-out';
          for (let i = 0; i < length / 5; i++) {
            // Reduced iterations for better performance
            if (Math.random() > 0.85) {
              const xCurrent = lastX + Math.random() * distance * xUnit;
              const yCurrent = lastY + Math.random() * distance * yUnit;
              const xRandom = xCurrent + (Math.random() - 0.5) * 3;
              const yRandom = yCurrent + (Math.random() - 0.5) * 3;
              const size = Math.random() * 0.8 + 0.4;
              ctx.beginPath();
              ctx.arc(xRandom, yRandom, size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      ctx.restore();
      lastCoordinates.current = { x, y };
    },
    [isMobile]
  );

  // Enhanced erase function with responsive sizing
  const eraseWithEffect = useCallback(
    (x: number, y: number, ctx: CanvasRenderingContext2D) => {
      const eraserSize = isMobile ? 20 : 25;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();

      lastCoordinates.current = { x, y };
    },
    [isMobile]
  );

  // Setup canvas with enhanced responsive properties
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance on mobile

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false, // Performance optimization
    });

    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    setIsCanvasReady(true);
  }, []);

  // Enhanced drawing event handlers with better touch support
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || !isCanvasReady) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setIsDrawing(true);
      lastCoordinates.current = { x, y };

      if (isErasing) {
        eraseWithEffect(x, y, ctx);
      } else {
        drawWithEffect(x, y, ctx);
      }
    },
    [isCanvasReady, isErasing, eraseWithEffect, drawWithEffect]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isErasing) {
        eraseWithEffect(x, y, ctx);
      } else {
        drawWithEffect(x, y, ctx);
      }
    },
    [isDrawing, isErasing, eraseWithEffect, drawWithEffect]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    lastCoordinates.current = { x: 0, y: 0 };
  }, []);

  // Touch event handlers with better mobile support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || !isCanvasReady) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setIsDrawing(true);
      lastCoordinates.current = { x, y };

      if (isErasing) {
        eraseWithEffect(x, y, ctx);
      } else {
        drawWithEffect(x, y, ctx);
      }
    },
    [isCanvasReady, isErasing, eraseWithEffect, drawWithEffect]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (isErasing) {
        eraseWithEffect(x, y, ctx);
      } else {
        drawWithEffect(x, y, ctx);
      }
    },
    [isDrawing, isErasing, eraseWithEffect, drawWithEffect]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDrawing(false);
    lastCoordinates.current = { x: 0, y: 0 };
  }, []);

  // Right-click to toggle erase mode
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsErasing((prev) => !prev);
  }, []);

  // Enhanced cursor style with theme awareness
  const getCursorStyle = useCallback(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const cursors = getCursorConfig();
    const theme = isDarkMode ? 'dark' : 'light';

    if (isErasing) {
      return cursors.eraser[theme];
    }
    return cursors.draw[theme];
  }, [isErasing]);

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create a new canvas for the final image with background
      const exportCanvas = document.createElement('canvas');
      const exportCtx = exportCanvas.getContext('2d');
      if (!exportCtx) return;

      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;

      // Set background based on theme
      const isDarkMode = document.documentElement.classList.contains('dark');
      exportCtx.fillStyle = isDarkMode ? '#1e1e1e' : '#ffffff';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw the canvas content
      exportCtx.drawImage(canvas, 0, 0);

      // Add branding
      exportCtx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
      exportCtx.font = '16px Arial';
      exportCtx.fillText('FLAMES Manual Mode', 20, exportCanvas.height - 20);

      exportCanvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `flames-${name1}-${name2}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error sharing canvas:', error);
    }
  };

  // Clear canvas function
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Initialize canvas on mount and resize
  useEffect(() => {
    const timer = setTimeout(() => {
      setupCanvas();
    }, 100);

    const handleResize = () => {
      setTimeout(setupCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [setupCanvas]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex min-h-screen w-full flex-col',
        isMobile ? 'pb-20' : 'pb-8' // Extra padding for mobile floating tools
      )}
    >
      {/* Background Pattern */}
      <div className="bg-[radial-gradient(circle_at_1px_1px,theme(colors.on-surface)_1px,transparent_0)] absolute inset-0 bg-[length:20px_20px] opacity-5" />

      {/* Header with Tools and Instructions */}
      <div
        className={cn(
          'flex w-full items-center justify-center gap-4 p-4',
          isMobile ? 'flex-col items-start space-y-3' : 'flex-row'
        )}
      >
        {!isMobile && (
          <CanvasTools
            isErasing={isErasing}
            onErase={() => setIsErasing(!isErasing)}
            onClear={handleClear}
            onBack={onBack}
            onShare={handleShare}
          />
        )}
        <CanvasInstructions />
      </div>

      {/* Main Canvas Area - Centered and Bigger */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div
          className={cn(
            'flex w-full max-w-6xl flex-col items-center justify-center space-y-6',
            isMobile && 'space-y-4'
          )}
        >
          {/* Main Canvas Container with Layered Content */}
          <motion.div
            ref={canvasContainerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              'relative w-full overflow-hidden rounded-xl shadow-2xl',
              'border-outline/20 bg-surface border backdrop-blur-sm'
            )}
            style={{
              height: canvasHeight,
              cursor: getCursorStyle(),
            }}
          >
            {/* Layer 1: Background with texture */}
            <div className="border-outline/30 bg-surface absolute inset-0 overflow-hidden rounded-xl border-2 shadow-2xl sm:rounded-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:20px_20px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
            </div>

            {/* Layer 2: Letter Tiles and FLAMES Letters */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-y-auto p-3 sm:p-6 lg:p-8"
              style={{ transform: `scale(${scaleFactor})` }}
            >
              <div className="space-y-8 sm:space-y-12">
                {/* Step 1: First Name */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="mb-4 flex items-center justify-center sm:mb-6">
                    <div className="bg-primary-container text-on-primary-container mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold sm:mr-4 sm:h-8 sm:w-8 sm:text-lg">
                      1
                    </div>
                    <h2 className="text-on-surface truncate text-lg font-bold sm:text-2xl md:text-3xl">
                      {name1.toUpperCase()}
                    </h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {name1Letters.map((letterData, index) => (
                      <motion.div
                        key={letterData.id}
                        className="bg-primary-container/30 border-primary-container text-on-surface flex h-12 w-12 items-center justify-center rounded-lg border text-lg font-bold transition-all duration-300 sm:h-16 sm:w-16 sm:rounded-xl sm:text-xl"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {letterData.letter}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Step 2: Second Name */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="mb-4 flex items-center justify-center sm:mb-6">
                    <div className="bg-tertiary-container text-on-tertiary-container mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold sm:mr-4 sm:h-8 sm:w-8 sm:text-lg">
                      2
                    </div>
                    <h2 className="text-on-surface truncate text-lg font-bold sm:text-2xl md:text-3xl">
                      {name2.toUpperCase()}
                    </h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {name2Letters.map((letterData, index) => (
                      <motion.div
                        key={letterData.id}
                        className="bg-tertiary-container/30 border-tertiary-container text-on-surface flex h-12 w-12 items-center justify-center rounded-lg border text-lg font-bold transition-all duration-300 sm:h-16 sm:w-16 sm:rounded-xl sm:text-xl"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.6 + index * 0.05,
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {letterData.letter}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Step 3: FLAMES Letters */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="mb-4 flex items-center justify-center sm:mb-6">
                    <div className="bg-secondary-container text-on-secondary-container mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold sm:mr-4 sm:h-8 sm:w-8 sm:text-lg">
                      3
                    </div>
                    <h2 className="text-on-surface text-lg font-bold sm:text-2xl md:text-3xl">F.L.A.M.E.S</h2>
                  </div>

                  <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6">
                    {flamesLetters.map((flame, index) => (
                      <motion.div
                        key={flame.id}
                        className="bg-secondary-container/30 border-secondary-container rounded-lg border p-2 text-center transition-all duration-300 sm:rounded-xl sm:p-4"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.8 + index * 0.1,
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="text-on-surface mb-1 text-lg font-bold sm:text-2xl">{flame.letter}</div>
                        <div className="mb-1 text-sm sm:text-xl">{flame.icon}</div>
                        <div className="text-on-surface-variant text-xs">{flame.meaning}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Layer 3: Canvas Drawing Layer */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full touch-none rounded-xl sm:rounded-2xl"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onContextMenu={handleContextMenu}
              style={{
                cursor: getCursorStyle(),
              }}
            />

            {/* Layer 4: Mode Indicator Overlay */}
            <AnimatePresence>
              {(isDrawing || isErasing) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-none absolute top-2 right-2 sm:top-4 sm:right-4"
                >
                  <div
                    className={`rounded-full border px-3 py-1 text-xs backdrop-blur-xl sm:px-4 sm:py-2 sm:text-sm ${
                      isErasing
                        ? 'bg-error-container/80 border-error text-on-error-container'
                        : 'bg-primary-container/80 border-primary text-on-primary-container'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current sm:h-2 sm:w-2" />
                      <span className="font-medium">{isErasing ? 'Erasing' : 'Drawing'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Canvas Loading State */}
            {!isCanvasReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="text-primary h-8 w-8" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile Tools at Bottom */}
      {isMobile && (
        <CanvasTools
          isErasing={isErasing}
          onErase={() => setIsErasing(!isErasing)}
          onClear={handleClear}
          onBack={onBack}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
