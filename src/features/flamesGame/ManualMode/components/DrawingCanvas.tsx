import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DrawingCanvasProps } from '../types';
import CanvasTools from './CanvasTools';
import FlamesLetters from './FlamesLetters';
import LetterTile from './LetterTile';

export default function DrawingCanvas({ name1, name2, mode, onBack, onShare, onModeToggle }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  // Custom cursor styles
  const getCursorStyle = useCallback(() => {
    if (isErasing) {
      return mode === 'chalkboard'
        ? "url(\"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ff6b6b' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E\") 12 12, auto"
        : "url(\"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ff6b6b' stroke='%23374151' stroke-width='2'/%3E%3C/svg%3E\") 12 12, auto";
    } else {
      return mode === 'chalkboard'
        ? "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='%23ffffff' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E\") 10 10, auto"
        : "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='%23374151' stroke='%23374151' stroke-width='2'/%3E%3C/svg%3E\") 10 10, auto";
    }
  }, [isErasing, mode]);

  // Background images for different modes
  const getBackgroundStyle = useCallback(() => {
    if (mode === 'chalkboard') {
      return {
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0),
          linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%)
        `,
        backgroundSize: '20px 20px, 40px 40px, 40px 40px',
        backgroundColor: '#1e293b',
      };
    } else {
      return {
        backgroundImage: `
          linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(180deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundColor: '#fefefe',
      };
    }
  }, [mode]);

  // Canvas drawing setup
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (mode === 'chalkboard') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = 2;
    } else {
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(31, 41, 55, 0.2)';
      ctx.shadowBlur = 1;
    }
  }, [mode]);

  // Drawing event handlers
  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (isErasing) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    },
    [isErasing]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (isErasing) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    },
    [isDrawing, isErasing]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Handle right-click for erasing
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsErasing(true);
      startDrawing(e);
    },
    [startDrawing]
  );

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Share canvas
  const handleShare = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      await onShare(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [onShare]);

  // Setup canvas when component mounts or mode changes
  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  return (
    <div className="min-h-screen overflow-auto" style={getBackgroundStyle()}>
      <div ref={containerRef} className="relative min-h-screen p-4">
        {/* Canvas Tools */}
        <CanvasTools
          mode={mode}
          isErasing={isErasing}
          onErase={() => setIsErasing(!isErasing)}
          onClear={clearCanvas}
          onBack={onBack}
          onShare={handleShare}
          onModeToggle={onModeToggle}
        />

        {/* Main Canvas Area */}
        <div className="mx-auto max-w-6xl space-y-8 pt-20">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className={`mb-2 text-3xl font-bold ${mode === 'chalkboard' ? 'text-white' : 'text-gray-800'}`}>
              {name1} ❤️ {name2}
            </h1>
            <p className={`text-lg ${mode === 'chalkboard' ? 'text-gray-300' : 'text-gray-600'}`}>
              Cross out common letters and calculate FLAMES manually!
            </p>
          </motion.div>

          {/* Name Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            {/* Name 1 Tiles */}
            <div
              className={`rounded-xl p-6 ${
                mode === 'chalkboard' ? 'border border-white/20 bg-white/10' : 'border border-gray-200 bg-white/80'
              }`}
            >
              <h3
                className={`mb-4 text-center text-xl font-semibold ${
                  mode === 'chalkboard' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {name1}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {name1.split('').map((letter, index) => (
                  <LetterTile key={`name1-${index}`} letter={letter} index={index} nameIndex={1} mode={mode} />
                ))}
              </div>
            </div>

            {/* Name 2 Tiles */}
            <div
              className={`rounded-xl p-6 ${
                mode === 'chalkboard' ? 'border border-white/20 bg-white/10' : 'border border-gray-200 bg-white/80'
              }`}
            >
              <h3
                className={`mb-4 text-center text-xl font-semibold ${
                  mode === 'chalkboard' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {name2}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {name2.split('').map((letter, index) => (
                  <LetterTile key={`name2-${index}`} letter={letter} index={index} nameIndex={2} mode={mode} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Drawing Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl p-6 ${
              mode === 'chalkboard' ? 'border border-white/10 bg-white/5' : 'border border-gray-200 bg-white/60'
            }`}
          >
            <h3
              className={`mb-4 text-center text-xl font-semibold ${
                mode === 'chalkboard' ? 'text-white' : 'text-gray-800'
              }`}
            >
              Drawing Area
            </h3>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className={`h-96 w-full rounded-lg border-2 ${
                  mode === 'chalkboard' ? 'border-white/30 bg-slate-800' : 'border-gray-300 bg-white'
                }`}
                style={{ cursor: getCursorStyle() }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onContextMenu={handleContextMenu}
              />

              {/* Canvas Instructions */}
              <div className="absolute top-2 left-2">
                <div
                  className={`rounded-full px-3 py-1 text-xs ${
                    mode === 'chalkboard' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isErasing ? 'Erasing Mode' : 'Drawing Mode'}
                </div>
              </div>
            </div>

            <p className={`mt-2 text-center text-sm ${mode === 'chalkboard' ? 'text-gray-400' : 'text-gray-500'}`}>
              Left click to draw • Right click to erase • Use the tools above for more options
            </p>
          </motion.div>

          {/* FLAMES Letters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <FlamesLetters mode={mode} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
