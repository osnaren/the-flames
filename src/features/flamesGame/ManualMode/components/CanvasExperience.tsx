import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CanvasExperienceProps } from '../types';
import CanvasInstructions from './CanvasInstructions';
import CanvasTools from './CanvasTools';

// Custom cursor data URLs for different tools
const CURSORS = {
  draw: '/assets/chalk.png',
  eraser: '/assets/duster_sm.png',
};

// Utility to get proper viewport height for mobile
const getViewportHeight = () => {
  // Use window.innerHeight on mobile for better handling of address bar
  if (typeof window !== 'undefined') {
    return window.innerHeight;
  }
  return 600; // Fallback for SSR
};

export default function CanvasExperience({ name1, name2, onBack, onShare }: CanvasExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const lastCoordinates = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Local state for drawing logic
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState('600px');
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Calculate responsive canvas height with mobile viewport fixes
  useEffect(() => {
    const calculateCanvasHeight = () => {
      const vh = getViewportHeight();
      const vw = window.innerWidth;

      if (vw < 640) {
        // Mobile - account for UI elements
        return `${Math.min(vh * 0.55, 450)}px`;
      } else if (vw < 1024) {
        // Tablet
        return `${Math.min(vh * 0.65, 550)}px`;
      } else {
        // Desktop
        return `${Math.min(vh * 0.7, 650)}px`;
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
  }, []);

  // Calculate letter positions for proper layout
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
  const drawWithEffect = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    ctx.save();

    const isDarkMode = document.documentElement.classList.contains('dark');
    const isMobile = window.innerWidth < 768;

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
  }, []);

  // Enhanced erase function with responsive sizing
  const eraseWithEffect = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    const isMobile = window.innerWidth < 768;
    const eraserSize = isMobile ? 20 : 25;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    lastCoordinates.current = { x, y };
  }, []);

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
      willReadFrequently: true,
      alpha: true,
    });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const isDarkMode = document.documentElement.classList.contains('dark');
    const isMobile = window.innerWidth < 768;

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1e40af';
    ctx.lineWidth = isDarkMode ? (isMobile ? 3 : 4) : isMobile ? 2.5 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Lighter shadow on mobile for performance
    if (!isMobile) {
      ctx.shadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 1;
    }

    setIsCanvasReady(true);
    return ctx;
  }, []);

  // Enhanced coordinate extraction with touch support
  const getCoordinates = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const handleClearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const toggleErase = useCallback(() => {
    setIsErasing((prev) => !prev);
  }, []);

  // Optimized drawing handlers using requestAnimationFrame
  const scheduleDrawing = useCallback(
    (coords: { x: number; y: number }) => {
      if (animationFrameRef.current) return; // Prevent multiple frames

      animationFrameRef.current = requestAnimationFrame(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          if (isErasing) {
            eraseWithEffect(coords.x, coords.y, ctx);
          } else {
            drawWithEffect(coords.x, coords.y, ctx);
          }
        }
        animationFrameRef.current = null;
      });
    },
    [isErasing, eraseWithEffect, drawWithEffect]
  );

  // Mouse event handlers
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isCanvasReady) return;

      const coords = getCoordinates(e.nativeEvent);
      lastCoordinates.current = { x: coords.x, y: coords.y };
      setIsDrawing(true);
      scheduleDrawing(coords);
    },
    [getCoordinates, scheduleDrawing, isCanvasReady]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isDrawing || !isCanvasReady) return;

      const coords = getCoordinates(e.nativeEvent);
      scheduleDrawing(coords);
    },
    [isDrawing, getCoordinates, scheduleDrawing, isCanvasReady]
  );

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Touch event handlers with better mobile experience
  const handleCanvasTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!isCanvasReady) return;

      const coords = getCoordinates(e.nativeEvent);
      lastCoordinates.current = { x: coords.x, y: coords.y };
      setIsDrawing(true);
      scheduleDrawing(coords);
    },
    [getCoordinates, scheduleDrawing, isCanvasReady]
  );

  const handleCanvasTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing || !isCanvasReady) return;

      const coords = getCoordinates(e.nativeEvent);
      scheduleDrawing(coords);
    },
    [isDrawing, getCoordinates, scheduleDrawing, isCanvasReady]
  );

  const handleCanvasTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      toggleErase();
    },
    [toggleErase]
  );

  // Get cursor style based on mode
  const getCursorStyle = () => {
    if (isErasing) {
      return `cursor-[url("${CURSORS.eraser}"),16_16,auto]`;
    } else {
      return `cursor-[url("${CURSORS.draw}"),8_8,auto]`;
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create a temporary canvas for the final image
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Set dimensions for sharing
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // Get theme-aware background
      const isDarkMode = document.documentElement.classList.contains('dark');
      tempCtx.fillStyle = isDarkMode ? '#0f172a' : '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Add subtle grid pattern
      tempCtx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      tempCtx.lineWidth = 1;
      const gridSize = 20;

      for (let x = 0; x < tempCanvas.width; x += gridSize) {
        tempCtx.beginPath();
        tempCtx.moveTo(x, 0);
        tempCtx.lineTo(x, tempCanvas.height);
        tempCtx.stroke();
      }

      for (let y = 0; y < tempCanvas.height; y += gridSize) {
        tempCtx.beginPath();
        tempCtx.moveTo(0, y);
        tempCtx.lineTo(tempCanvas.width, y);
        tempCtx.stroke();
      }

      // Draw the actual canvas content
      tempCtx.drawImage(canvas, 0, 0);

      // Add watermark
      tempCtx.fillStyle = isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
      tempCtx.font = '16px system-ui, -apple-system, sans-serif';
      tempCtx.textAlign = 'right';
      tempCtx.fillText(`${name1} ❤️ ${name2} - FLAMES Canvas`, tempCanvas.width - 20, tempCanvas.height - 20);

      // Convert to blob and trigger download
      tempCanvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `flames-canvas-${name1}-${name2}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Call the parent share handler if provided
          if (onShare) {
            onShare('data:image/png;base64,base64encodedstring'); // Provide dummy data since parent expects string
          }
        },
        'image/png',
        0.95
      );
    } catch (error) {
      console.error('Error sharing canvas:', error);
    }
  };

  // Setup canvas on mount and resize
  useEffect(() => {
    const timer = setTimeout(() => {
      setupCanvas();

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.tabIndex = 1;
        canvas.focus();
        canvas.style.outline = 'none';
      }
    }, 300); // Slightly longer delay for mobile

    return () => clearTimeout(timer);
  }, [setupCanvas, canvasHeight]);

  // Handle resize and cleanup
  useEffect(() => {
    const handleResize = () => {
      setTimeout(setupCanvas, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setupCanvas]);

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Background Pattern */}
      <div className="bg-[radial-gradient(circle_at_1px_1px,theme(colors.on-surface)_1px,transparent_0)] absolute inset-0 bg-[length:20px_20px] opacity-5" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Sticky Header with Tools */}
        <div className="sticky top-0 z-50 w-full">
          <div className="bg-background/80 border-outline/20 border-b backdrop-blur-xl">
            <div className="container mx-auto px-4 py-3">
              <CanvasTools
                isErasing={isErasing}
                onErase={toggleErase}
                onClear={handleClearCanvas}
                onBack={onBack}
                onShare={handleShare}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-center sm:mb-8"
            >
              <div className="mb-4 flex items-center justify-center">
                <Sparkles className="text-primary mr-3 h-6 w-6 sm:h-8 sm:w-8" />
                <h1 className="text-on-surface text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
                  {name1} ❤️ {name2}
                </h1>
                <Sparkles className="text-primary ml-3 h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <p className="text-on-surface-variant text-sm sm:text-base lg:text-lg">
                Draw over the letters to strike them out
              </p>
            </motion.div>

            {/* Main Canvas Container with Layered Content */}
            <motion.div
              ref={canvasContainerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-6xl"
              style={{ height: canvasHeight }}
            >
              {/* Layer 1: Background with texture */}
              <div className="border-outline/30 bg-surface absolute inset-0 overflow-hidden rounded-xl border-2 shadow-2xl sm:rounded-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:20px_20px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
              </div>

              {/* Layer 2: Letter Tiles and FLAMES Letters */}
              <div className="pointer-events-none absolute inset-0 overflow-y-auto p-3 sm:p-6 lg:p-8">
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
                className={`absolute inset-0 h-full w-full rounded-xl sm:rounded-2xl ${getCursorStyle()}`}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
                onContextMenu={handleRightClick}
                style={{
                  touchAction: 'none',
                  cursor: isErasing ? 'cell' : 'crosshair',
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

              {/* Canvas Loading Indicator */}
              {!isCanvasReady && (
                <div className="bg-surface/50 absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm sm:rounded-2xl">
                  <div className="text-on-surface-variant text-center">
                    <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                    <p className="text-sm">Setting up canvas...</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Sticky Bottom Instructions */}
        <div className="sticky bottom-0 z-40 w-full">
          <div className="bg-background/80 border-outline/20 border-t backdrop-blur-xl">
            <div className="container mx-auto px-4 py-3">
              <CanvasInstructions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
