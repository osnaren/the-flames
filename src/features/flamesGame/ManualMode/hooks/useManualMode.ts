import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { ExperienceMode, ManualModeState } from '../types';
import {
  clearCanvas,
  eraseArea,
  generateShareableImage,
  getCanvasPoint,
  getEventPoint,
  getUrlParams,
  setupCanvas,
  updateUrlParams,
  validateNameInput,
} from '../utils';

export function useManualMode() {
  // Get initial names from URL params
  const urlParams = getUrlParams();

  const [state, setState] = useState<ManualModeState>({
    name1: urlParams.name1 || '',
    name2: urlParams.name2 || '',
    experienceMode: 'click',
    canvasState: urlParams.name1 && urlParams.name2 ? 'experience' : 'input',
    isDrawing: false,
    isErasing: false,
    crossedLetters: new Set<string>(),
    flamesCrossedLetters: new Set<string>(),
    result: null,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupCanvas(canvas);
    ctxRef.current = ctx;
  }, []);

  // Handle names submission
  const handleNamesSubmit = useCallback(
    (name1: string, name2: string, experienceMode: ExperienceMode) => {
      const error1 = validateNameInput(name1);
      const error2 = validateNameInput(name2);

      if (error1) {
        toast.error(`Name 1: ${error1}`);
        return;
      }

      if (error2) {
        toast.error(`Name 2: ${error2}`);
        return;
      }

      if (name1.toLowerCase() === name2.toLowerCase()) {
        toast.error('Names cannot be the same');
        return;
      }

      setState((prev) => ({
        ...prev,
        name1,
        name2,
        experienceMode,
        canvasState: 'experience',
      }));

      updateUrlParams(name1, name2);

      // Initialize canvas after state update only for canvas mode
      if (experienceMode === 'canvas') {
        setTimeout(() => {
          initializeCanvas();
        }, 100);
      }
    },
    [initializeCanvas]
  );

  // Go back to input
  const goBackToInput = useCallback(() => {
    setState((prev) => ({
      ...prev,
      canvasState: 'input',
      crossedLetters: new Set<string>(),
      flamesCrossedLetters: new Set<string>(),
      result: null,
    }));
  }, []);

  // Drawing functions (for canvas mode only)
  const startDrawing = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || state.experienceMode !== 'canvas') return;

      const { clientX, clientY } = getEventPoint(e);
      const point = getCanvasPoint(canvas, clientX, clientY);

      setState((prev) => ({ ...prev, isDrawing: true }));
      lastPointRef.current = point;

      if (state.isErasing) {
        eraseArea(ctx, point.x, point.y);
      } else {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
      }
    },
    [state.isErasing, state.experienceMode]
  );

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!state.isDrawing || state.experienceMode !== 'canvas') return;

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || !lastPointRef.current) return;

      const { clientX, clientY } = getEventPoint(e);
      const point = getCanvasPoint(canvas, clientX, clientY);

      if (state.isErasing) {
        eraseArea(ctx, point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }

      lastPointRef.current = point;
    },
    [state.isDrawing, state.isErasing, state.experienceMode]
  );

  const stopDrawing = useCallback(() => {
    setState((prev) => ({ ...prev, isDrawing: false }));
    lastPointRef.current = null;
  }, []);

  // Erase mode toggle (canvas mode only)
  const toggleErase = useCallback(() => {
    if (state.experienceMode !== 'canvas') return;
    setState((prev) => ({ ...prev, isErasing: !prev.isErasing }));
  }, [state.experienceMode]);

  // Clear canvas (canvas mode only)
  const clearCanvasArea = useCallback(() => {
    if (state.experienceMode !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    clearCanvas(canvas);
    initializeCanvas();
  }, [initializeCanvas, state.experienceMode]);

  // Letter toggle functions (click mode only)
  const toggleLetter = useCallback(
    (letterKey: string) => {
      if (state.experienceMode !== 'click') return;

      setState((prev) => {
        const newCrossedLetters = new Set(prev.crossedLetters);
        if (newCrossedLetters.has(letterKey)) {
          newCrossedLetters.delete(letterKey);
        } else {
          newCrossedLetters.add(letterKey);
        }
        return { ...prev, crossedLetters: newCrossedLetters };
      });
    },
    [state.experienceMode]
  );

  const toggleFlamesLetter = useCallback(
    (letter: string) => {
      if (state.experienceMode !== 'click') return;

      setState((prev) => {
        const newFlamesCrossedLetters = new Set(prev.flamesCrossedLetters);
        if (newFlamesCrossedLetters.has(letter)) {
          newFlamesCrossedLetters.delete(letter);
        } else {
          newFlamesCrossedLetters.add(letter);
        }
        return { ...prev, flamesCrossedLetters: newFlamesCrossedLetters };
      });
    },
    [state.experienceMode]
  );

  // Share functionality
  const handleShare = useCallback(async () => {
    if (state.experienceMode === 'canvas') {
      const canvas = canvasRef.current;
      if (!canvas || !state.name1 || !state.name2) return;

      try {
        const imageData = await generateShareableImage(canvas, state.name1, state.name2);

        if (navigator.share && navigator.canShare?.({ files: [new File([imageData], 'flames.png')] })) {
          // Convert data URL to blob
          const response = await fetch(imageData);
          const blob = await response.blob();
          const file = new File([blob], 'flames-manual-mode.png', { type: 'image/png' });

          await navigator.share({
            title: 'FLAMES Manual Mode',
            text: `${state.name1} ❤️ ${state.name2}`,
            files: [file],
          });
        } else {
          // Fallback: download image
          const link = document.createElement('a');
          link.download = 'flames-manual-mode.png';
          link.href = imageData;
          link.click();
        }

        toast.success('Image saved/shared successfully!');
      } catch (error) {
        toast.error('Failed to share image');
        console.error('Share error:', error);
      }
    } else {
      // For click mode, generate a screenshot or create a summary
      toast.success('Share functionality for click mode coming soon!');
    }
  }, [state.experienceMode, state.name1, state.name2]);

  // Reset everything
  const handleReset = useCallback(() => {
    setState({
      name1: '',
      name2: '',
      experienceMode: 'click',
      canvasState: 'input',
      isDrawing: false,
      isErasing: false,
      crossedLetters: new Set<string>(),
      flamesCrossedLetters: new Set<string>(),
      result: null,
    });

    // Clear URL params
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('name1');
      url.searchParams.delete('name2');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Initialize canvas when state changes (canvas mode only)
  useEffect(() => {
    if (state.canvasState === 'experience' && state.experienceMode === 'canvas') {
      initializeCanvas();
    }
  }, [state.canvasState, state.experienceMode, initializeCanvas]);

  return {
    state,
    canvasRef,
    handlers: {
      handleNamesSubmit,
      goBackToInput,
      handleShare,
      // Canvas mode handlers
      startDrawing,
      draw,
      stopDrawing,
      toggleErase,
      clearCanvasArea,
      // Click mode handlers
      toggleLetter,
      toggleFlamesLetter,
      handleReset,
    },
    utils: {
      initializeCanvas,
    },
  };
}
