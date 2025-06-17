import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useManualMode } from '../hooks/useManualMode';
import type { CanvasExperienceProps } from '../types';
import CanvasInstructions from './CanvasInstructions';
import CanvasTools from './CanvasTools';

// Custom cursor data URLs for different tools
const CURSORS = {
  draw: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMTcuMjVWMjEuMjVINy4yNUwxOC44MSA5LjY5TDE0LjMxIDUuMTlMMi43NSAxNi42M1YxNy4yNUgzWk0yMC43MSA3LjA0QzIxLjEgNi42NSAyMS4xIDYuMDIgMjAuNzEgNS42M0wxOC4zNyAzLjI5QzE3Ljk4IDIuOSAxNy4zNSAyLjkgMTYuOTYgMy4yOUwxNS4xMyA1LjEyTDE4Ljg4IDguODdMMjAuNzEgNy4wNFoiIGZpbGw9IiMyNTYzRUIiLz4KPHN2Zz4=',
  eraser:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNSAyMUgxN0wyMSAxN0wxNi41IDEyLjVMNy41IDIxWk01IDEzTDEzIDVMMTkgMTFMMTEgMTlMNSAxM1oiIGZpbGw9IiNGNTkyOTIiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==',
};

export default function CanvasExperience({ name1, name2, onBack, onShare }: CanvasExperienceProps) {
  const { state, canvasRef, handlers } = useManualMode();
  const containerRef = useRef<HTMLDivElement>(null);
  // Use refs for immediate coordinate tracking instead of state
  const lastCoordinates = useRef({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);

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
    { letter: 'F', meaning: 'Friends', icon: '👫' },
    { letter: 'L', meaning: 'Love', icon: '💕' },
    { letter: 'A', meaning: 'Affection', icon: '🥰' },
    { letter: 'M', meaning: 'Marriage', icon: '💒' },
    { letter: 'E', meaning: 'Enemies', icon: '⚔️' },
    { letter: 'S', meaning: 'Siblings', icon: '👨‍👩‍👧‍👦' },
  ].map((flame, index) => ({
    ...flame,
    id: `flames-${index}`,
  }));

  // Enhanced drawing function that adapts to theme
  const drawWithEffect = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    // Save the current drawing state (styles, etc.)
    ctx.save();

    // Set the drawing style based on theme
    const isDarkMode = document.documentElement.classList.contains('dark');

    if (isDarkMode) {
      // Dark theme - lighter drawing for visibility
      const opacity = 0.7 + Math.random() * 0.3;
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      // Light theme - darker drawing
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    const lastX = lastCoordinates.current.x;
    const lastY = lastCoordinates.current.y;

    // Skip drawing if this is the first point (just record position)
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

    // Add texture effects for dark theme
    if (isDarkMode) {
      const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
      const length = Math.max(5, Math.round(distance));

      // Only add texture if we've moved far enough
      if (distance > 2) {
        const xUnit = (x - lastX) / (length || 1);
        const yUnit = (y - lastY) / (length || 1);

        // Add texture effect
        ctx.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < length / 3; i++) {
          if (Math.random() > 0.7) {
            const xCurrent = lastX + Math.random() * distance * xUnit;
            const yCurrent = lastY + Math.random() * distance * yUnit;
            const xRandom = xCurrent + (Math.random() - 0.5) * 6;
            const yRandom = yCurrent + (Math.random() - 0.5) * 6;
            const size = Math.random() * 1.5 + 0.5;
            ctx.beginPath();
            ctx.arc(xRandom, yRandom, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Restore original canvas state
    ctx.restore();

    // Update last position
    lastCoordinates.current = { x, y };
  }, []);

  // Enhanced erase function
  const eraseWithEffect = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    const eraserSize = 30;

    // Use arc for a more natural circular eraser
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    // Update last position for smooth erasing
    lastCoordinates.current = { x, y };
  }, []);

  // Setup canvas with enhanced properties
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas dimensions
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale for high DPI displays
    ctx.scale(dpr, dpr);

    // Set basic drawing properties
    const isDarkMode = document.documentElement.classList.contains('dark');

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1e40af';
    ctx.lineWidth = isDarkMode ? 4 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Add subtle shadow for better visibility
    ctx.shadowColor = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 1;

    return ctx;
  }, [canvasRef]);

  // Enhanced mouse/touch event handlers
  const getCoordinates = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    [canvasRef]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const coords = getCoordinates(e.nativeEvent);
      lastCoordinates.current = { x: coords.x, y: coords.y };
      isDrawingRef.current = true;

      // Start drawing with hook handler first (this sets the state)
      handlers.startDrawing(e.nativeEvent);

      // Draw a single point to start (immediate feedback)
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        if (state.isErasing) {
          eraseWithEffect(coords.x, coords.y, ctx);
        } else {
          // Draw a small dot at the starting point
          const isDarkMode = document.documentElement.classList.contains('dark');
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, isDarkMode ? 2 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    [getCoordinates, state.isErasing, eraseWithEffect, canvasRef, handlers]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // Check our ref-based drawing state for immediate response
      if (!isDrawingRef.current) return;

      const coords = getCoordinates(e.nativeEvent);
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      if (state.isErasing) {
        eraseWithEffect(coords.x, coords.y, ctx);
      } else {
        drawWithEffect(coords.x, coords.y, ctx);
      }

      // Also call the hook's draw function for state management
      handlers.draw?.(e.nativeEvent);
    },
    [state.isErasing, getCoordinates, drawWithEffect, eraseWithEffect, canvasRef, handlers]
  );

  const handleCanvasMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
      handlers.stopDrawing();
    },
    [handlers]
  );

  const handleCanvasTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const coords = getCoordinates(e.nativeEvent);
      lastCoordinates.current = { x: coords.x, y: coords.y };
      isDrawingRef.current = true;

      // Start drawing with hook handler first (this sets the state)
      handlers.startDrawing(e.nativeEvent);

      // Draw a single point to start (immediate feedback)
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        if (state.isErasing) {
          eraseWithEffect(coords.x, coords.y, ctx);
        } else {
          // Draw a small dot at the starting point
          const isDarkMode = document.documentElement.classList.contains('dark');
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, isDarkMode ? 2 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    [getCoordinates, state.isErasing, eraseWithEffect, canvasRef, handlers]
  );

  const handleCanvasTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      // Check our ref-based drawing state for immediate response
      if (!isDrawingRef.current) return;

      const coords = getCoordinates(e.nativeEvent);
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      if (state.isErasing) {
        eraseWithEffect(coords.x, coords.y, ctx);
      } else {
        drawWithEffect(coords.x, coords.y, ctx);
      }

      // Also call the hook's draw function for state management
      handlers.draw?.(e.nativeEvent);
    },
    [state.isErasing, getCoordinates, drawWithEffect, eraseWithEffect, canvasRef, handlers]
  );

  const handleCanvasTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
      handlers.stopDrawing();
    },
    [handlers]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handlers.toggleErase();
    },
    [handlers]
  );

  // Get cursor style based on mode
  const getCursorStyle = () => {
    if (state.isErasing) {
      return `cursor-[url("${CURSORS.eraser}"),16_16,auto]`;
    } else {
      return `cursor-[url("${CURSORS.draw}"),8_24,auto]`;
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create a new canvas for final output with background
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d');
      if (!outputCtx) return;

      // Draw background based on theme
      const isDarkMode = document.documentElement.classList.contains('dark');
      outputCtx.fillStyle = isDarkMode ? '#1e293b' : '#ffffff';
      outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

      // Draw the original canvas content
      outputCtx.drawImage(canvas, 0, 0);

      // Add branding
      outputCtx.font = '16px Inter, sans-serif';
      outputCtx.fillStyle = isDarkMode ? '#ffffff' : '#1e293b';
      outputCtx.fillText(`${name1} ❤️ ${name2} - FLAMES Canvas`, 20, outputCanvas.height - 20);

      const imageData = outputCanvas.toDataURL('image/png', 0.9);

      if (navigator.share && 'canShare' in navigator) {
        const blob = await fetch(imageData).then((r) => r.blob());
        const file = new File([blob], 'flames-canvas-result.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'FLAMES Canvas Result',
            text: `${name1} ❤️ ${name2} - Canvas Mode`,
            files: [file],
          });
        } else {
          // Fallback to download
          const link = document.createElement('a');
          link.download = `flames-canvas-${name1}-${name2}.png`;
          link.href = imageData;
          link.click();
        }
      } else {
        // Fallback: download
        const link = document.createElement('a');
        link.download = `flames-canvas-${name1}-${name2}.png`;
        link.href = imageData;
        link.click();
      }

      onShare(imageData);
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback to simple download
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `flames-canvas-${name1}-${name2}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  // Setup canvas on mount and visual mode change
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = setupCanvas();
      // Initialize with clean slate
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      // Ensure the canvas receives proper focus for input events
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.tabIndex = 1; // Make canvas focusable
        canvas.focus(); // Focus the canvas
        canvas.style.outline = 'none'; // Remove outline when focused
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [setupCanvas, canvasRef]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(setupCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  return (
    <div className="bg-background relative min-h-screen">
      {/* Background Pattern */}
      <div className="bg-[radial-gradient(circle_at_1px_1px,theme(colors.on-surface)_1px,transparent_0)] absolute inset-0 bg-[length:20px_20px] opacity-5" />

      <div className="relative z-10 min-h-screen p-4">
        {/* Floating Canvas Tools */}
        <CanvasTools
          isErasing={state.isErasing}
          onErase={handlers.toggleErase}
          onClear={handlers.clearCanvasArea}
          onBack={onBack}
          onShare={handleShare}
        />

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 pt-20 text-center"
        >
          <div className="mb-4 flex items-center justify-center">
            <Sparkles className="text-primary mr-3 h-8 w-8" />
            <h1 className="text-on-surface text-4xl font-bold md:text-5xl">
              {name1} ❤️ {name2}
            </h1>
            <Sparkles className="text-primary ml-3 h-8 w-8" />
          </div>
          <p className="text-on-surface-variant text-lg">Draw over the letters to strike them out</p>
        </motion.div>

        {/* Main Canvas Container with Layered Content */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto max-w-6xl"
          style={{ height: '700px' }}
        >
          {/* Layer 1: Background with texture */}
          <div className="border-outline/30 bg-surface absolute inset-0 overflow-hidden rounded-2xl border-2 shadow-2xl">
            {/* Paper texture */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:20px_20px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
          </div>

          {/* Layer 2: Letter Tiles and FLAMES Letters */}
          <div className="pointer-events-none absolute inset-0 p-8">
            {/* Names Section */}
            <div className="space-y-12">
              {/* Step 1: First Name */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="mb-6 flex items-center justify-center">
                  <div className="bg-primary-container text-on-primary-container mr-4 flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold">
                    1
                  </div>
                  <h2 className="text-on-surface text-2xl font-bold md:text-3xl">{name1.toUpperCase()}</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {name1Letters.map((letterData, index) => (
                    <motion.div
                      key={letterData.id}
                      className="bg-primary-container/30 border-primary-container text-on-surface flex h-16 w-16 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-300"
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
                <div className="mb-6 flex items-center justify-center">
                  <div className="bg-tertiary-container text-on-tertiary-container mr-4 flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold">
                    2
                  </div>
                  <h2 className="text-on-surface text-2xl font-bold md:text-3xl">{name2.toUpperCase()}</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {name2Letters.map((letterData, index) => (
                    <motion.div
                      key={letterData.id}
                      className="bg-tertiary-container/30 border-tertiary-container text-on-surface flex h-16 w-16 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-300"
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
                <div className="mb-6 flex items-center justify-center">
                  <div className="bg-secondary-container text-on-secondary-container mr-4 flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold">
                    3
                  </div>
                  <h2 className="text-on-surface text-2xl font-bold md:text-3xl">F.L.A.M.E.S</h2>
                </div>

                <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 md:grid-cols-6">
                  {flamesLetters.map((flame, index) => (
                    <motion.div
                      key={flame.id}
                      className="bg-secondary-container/30 border-secondary-container rounded-xl border p-4 text-center transition-all duration-300"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.8 + index * 0.1,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div className="text-on-surface mb-1 text-2xl font-bold">{flame.letter}</div>
                      <div className="mb-1 text-xl">{flame.icon}</div>
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
            className={`absolute inset-0 h-full w-full rounded-2xl ${getCursorStyle()}`}
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
              cursor: state.isErasing ? 'cell' : 'crosshair', // Fallback cursors if custom cursors fail
            }}
          />

          {/* Layer 4: Mode Indicator Overlay */}
          <AnimatePresence>
            {(state.isDrawing || state.isErasing) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="pointer-events-none absolute top-4 right-4"
              >
                <div
                  className={`rounded-full border px-4 py-2 backdrop-blur-xl ${
                    state.isErasing
                      ? 'bg-error-container/80 border-error text-on-error-container'
                      : 'bg-primary-container/80 border-primary text-on-primary-container'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                    <span className="text-sm font-medium">{state.isErasing ? 'Erasing' : 'Drawing'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Collapsible Instructions Component */}
        <CanvasInstructions />
      </div>
    </div>
  );
}
