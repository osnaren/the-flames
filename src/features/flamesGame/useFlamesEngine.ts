import { useState, useCallback, useMemo } from 'react';
import { FlamesResult, GameStage } from './flames.types';
import { nameSchema, calculateFlamesResult, findCommonLetters } from './flames.utils';
import { insertMatch } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface FlamesEngineOptions {
  animationsEnabled: boolean;
}

interface FlamesEngineState {
  name1: string;
  name2: string;
  result: FlamesResult;
  stage: GameStage;
  commonLetters: string[];
  slotStopIndex: number;
}

interface FlamesEngineActions {
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetGame: () => void;
}

/**
 * Custom hook for managing the FLAMES game logic
 */
export function useFlamesEngine({ animationsEnabled }: FlamesEngineOptions): 
  [FlamesEngineState, FlamesEngineActions] {
  
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<FlamesResult>(null);
  const [stage, setStage] = useState<GameStage>('input');
  const [commonLetters, setCommonLetters] = useState<string[]>([]);
  const [slotStopIndex, setSlotStopIndex] = useState<number>(-1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  
  // Check for reduced motion preference
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleMediaChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }
  }, []);
  
  // Determine if animations should be used based on both user settings and system preferences
  const shouldAnimate = useMemo(() => {
    return animationsEnabled && !prefersReducedMotion;
  }, [animationsEnabled, prefersReducedMotion]);
  
  // Memoized name setters with validation feedback
  const handleSetName1 = useCallback((input: string) => {
    setName1(input);
  }, []);
  
  const handleSetName2 = useCallback((input: string) => {
    setName2(input);
  }, []);
  
  /**
   * Validate and process the form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate inputs
      const validName1 = nameSchema.parse(name1);
      const validName2 = nameSchema.parse(name2);

      if (validName1.toLowerCase() === validName2.toLowerCase()) {
        toast.error('Names cannot be the same!');
        return;
      }

      // Begin processing
      setStage('processing');
      const delay = shouldAnimate ? 1500 : 100;

      // Optimize with a single setTimeout rather than nested ones
      setTimeout(async () => {
        // Find common letters
        const common = findCommonLetters(validName1, validName2);
        setCommonLetters(common);
        
        // Calculate the result
        const flamesResult = calculateFlamesResult(validName1, validName2);
        setResult(flamesResult);
        
        // Record the match in Supabase (non-blocking) only if result is not null
        if (flamesResult !== null) {
          insertMatch(validName1, validName2, flamesResult).catch(error => {
            console.error('Failed to record match:', error);
          });
        }
        
        if (shouldAnimate) {
          // Animate slot machine effect with optimized timeouts
          const slotDelays = [500, 800, 1100, 1400, 1700, 2000];
          
          // Use a more efficient approach with a single setTimeout per index
          slotDelays.forEach((delay, index) => {
            setTimeout(() => {
              setSlotStopIndex(index);
              
              // When all letters have stopped, show the final result
              if (index === 5) {
                setTimeout(() => setStage('result'), 800);
              }
            }, delay);
          });
        } else {
          // Skip animations
          setSlotStopIndex(5);
          setStage('result');
        }
      }, delay);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Unexpected error:', error);
        toast.error('Something went wrong. Please try again.');
      }
    }
  }, [name1, name2, shouldAnimate]);
  
  /**
   * Reset the game state
   */
  const resetGame = useCallback(() => {
    setName1('');
    setName2('');
    setResult(null);
    setStage('input');
    setCommonLetters([]);
    setSlotStopIndex(-1);
  }, []);
  
  // Memoize the state object to prevent unnecessary re-renders
  const state = useMemo((): FlamesEngineState => {
    return { name1, name2, result, stage, commonLetters, slotStopIndex };
  }, [name1, name2, result, stage, commonLetters, slotStopIndex]);
  
  // Memoize the actions object to prevent unnecessary re-renders
  const actions = useMemo((): FlamesEngineActions => {
    return { 
      setName1: handleSetName1, 
      setName2: handleSetName2, 
      handleSubmit, 
      resetGame 
    };
  }, [handleSetName1, handleSetName2, handleSubmit, resetGame]);
  
  return [state, actions];
}