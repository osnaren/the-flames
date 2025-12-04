import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FlamesResult } from '../../flames.types';
import { generateCanvasImage, generateClickResultImage, saveImage, shareImage } from '../image.utils';
import type { ExperienceMode, ManualModeState } from '../types';
import {
  clearCanvas,
  eraseArea,
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

  // Add loading states for operations
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // Share and Save Functionality
  const handleShare = useCallback(async () => {
    const { experienceMode, name1, name2, result } = state;
    if (!name1 || !name2) {
      toast.error('Please enter both names first!');
      return;
    }

    if (isSharing) return; // Prevent multiple simultaneous operations
    setIsSharing(true); // Set sharing state to true
    try {
      let imageDataUrl: string;
      if (experienceMode === 'canvas') {
        const canvas = canvasRef.current;
        if (!canvas) {
          toast.error('Canvas is not ready. Please wait a moment and try again.');
          return;
        }

        // Check if canvas has any content
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast.error('Canvas context is not available.');
          return;
        }

        imageDataUrl = await generateCanvasImage(canvas, name1, name2);
      } else {
        // For click experience, allow sharing even without complete result
        // If no result yet, share the current progress
        const resultToShare = result || 'In Progress';
        imageDataUrl = await generateClickResultImage(name1, name2, resultToShare as FlamesResult);
      }
      await shareImage(imageDataUrl, name1, name2);
      toast.success('Result shared successfully!');
    } catch (error) {
      console.error('Sharing failed:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('oklch') || error.message.includes('unsupported color')) {
          toast.error('Image generation failed due to color format issues. Please try again.');
        } else if (error.message.includes('Canvas')) {
          toast.error('Canvas not ready. Please wait a moment and try again.');
        } else {
          toast.error(`Share failed: ${error.message}`);
        }
      } else {
        toast.error('Could not share the result. Please try again.');
      }
    } finally {
      setIsSharing(false); // Reset sharing state
    }
  }, [state, isSharing]);

  const handleSave = useCallback(async () => {
    const { experienceMode, name1, name2, result } = state;
    if (!name1 || !name2) {
      toast.error('Please enter both names first!');
      return;
    }
    const filename = `${name1}_${name2}-FLAMES.png`;

    if (isSaving) return; // Prevent multiple simultaneous operations
    setIsSaving(true); // Set saving state to true
    try {
      let imageDataUrl: string;
      if (experienceMode === 'canvas') {
        const canvas = canvasRef.current;
        if (!canvas) {
          toast.error('Canvas is not ready. Please wait a moment and try again.');
          return;
        }

        // Check if canvas has any content
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast.error('Canvas context is not available.');
          return;
        }

        imageDataUrl = await generateCanvasImage(canvas, name1, name2);
      } else {
        // For click experience, allow saving even without complete result
        const resultToSave = result || 'In Progress';
        imageDataUrl = await generateClickResultImage(name1, name2, resultToSave as FlamesResult);
      }
      saveImage(imageDataUrl, filename);
      toast.success('Image saved successfully!');
    } catch (error) {
      console.error('Saving failed:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('oklch') || error.message.includes('unsupported color')) {
          toast.error('Image generation failed due to color format issues. Please try again.');
        } else if (error.message.includes('Canvas')) {
          toast.error('Canvas not ready. Please wait a moment and try again.');
        } else {
          toast.error(`Save failed: ${error.message}`);
        }
      } else {
        toast.error('Could not save the result. Please try again.');
      }
    } finally {
      setIsSaving(false); // Reset saving state
    }
  }, [state, isSaving]);

  // Callback to update result from ClickExperience
  const handleResultChange = useCallback((newResult: string | null) => {
    setState((prev) => ({ ...prev, result: newResult }));
  }, []);

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
    ...state,
    canvasRef,
    isSharing, // Expose sharing state
    isSaving, // Expose saving state

    handleNamesSubmit,
    goBackToInput,
    handleShare,
    handleSave,
    handleResultChange,
    handleReset,

    // Canvas mode handlers
    startDrawing,
    draw,
    stopDrawing,
    toggleErase,
    clearCanvasArea,

    // Click mode handlers
    toggleLetter,
    toggleFlamesLetter,

    utils: {
      initializeCanvas,
    },
  };
}
