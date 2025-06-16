import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { ManualModeState } from '../types';
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
    mode: 'chalkboard',
    canvasState: urlParams.name1 && urlParams.name2 ? 'drawing' : 'input',
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

    const ctx = setupCanvas(canvas, state.mode);
    ctxRef.current = ctx;
  }, [state.mode]);

  // Handle names submission
  const handleNamesSubmit = useCallback(
    (name1: string, name2: string) => {
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
        canvasState: 'drawing',
      }));

      updateUrlParams(name1, name2);

      // Initialize canvas after state update
      setTimeout(() => {
        initializeCanvas();
      }, 100);
    },
    [initializeCanvas]
  );

  // Toggle drawing mode
  const toggleMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mode: prev.mode === 'chalkboard' ? 'pen-paper' : 'chalkboard',
    }));
  }, []);

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

  // Drawing functions
  const startDrawing = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

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
    [state.isErasing]
  );

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!state.isDrawing) return;

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
    [state.isDrawing, state.isErasing]
  );

  const stopDrawing = useCallback(() => {
    setState((prev) => ({ ...prev, isDrawing: false }));
    lastPointRef.current = null;
  }, []);

  // Erase mode toggle
  const toggleErase = useCallback(() => {
    setState((prev) => ({ ...prev, isErasing: !prev.isErasing }));
  }, []);

  // Clear canvas
  const clearCanvasArea = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    clearCanvas(canvas);
    initializeCanvas();
  }, [initializeCanvas]);

  // Share functionality
  const handleShare = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !state.name1 || !state.name2) return;

    try {
      const imageData = await generateShareableImage(canvas, state.name1, state.name2, state.mode);

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
  }, [state.name1, state.name2, state.mode]);

  // Reset everything
  const handleReset = useCallback(() => {
    setState({
      name1: '',
      name2: '',
      mode: 'chalkboard',
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

  // Initialize canvas when mode changes
  useEffect(() => {
    if (state.canvasState === 'drawing') {
      initializeCanvas();
    }
  }, [state.mode, state.canvasState, initializeCanvas]);

  return {
    state,
    canvasRef,
    handlers: {
      handleNamesSubmit,
      toggleMode,
      goBackToInput,
      startDrawing,
      draw,
      stopDrawing,
      toggleErase,
      clearCanvasArea,
      handleShare,
      handleReset,
    },
    utils: {
      initializeCanvas,
    },
  };
}
