import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { insertMatch } from '@lib/supabase';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { FlamesResult, GameStage } from './flames.types';
import { calculateFlamesResult, findCommonLetters, nameSchema } from './flames.utils';

interface FlamesEngineState {
  name1: string;
  name2: string;
  result: FlamesResult;
  stage: GameStage;
  commonLetters: string[];
  slotStopIndex: number;
  anonymous: boolean;
  isSlotMachineAnimating: boolean;
}

interface FlamesEngineActions {
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetGame: () => void;
  setAnonymous: (value: boolean) => void;
  onSlotMachineComplete: () => void;
}

/**
 * Custom hook for managing the FLAMES game logic
 */
export function useFlamesEngine(): [FlamesEngineState, FlamesEngineActions] {
  // Initialize with empty strings and input stage
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<FlamesResult>(null);
  const [stage, setStage] = useState<GameStage>('input');
  const [commonLetters, setCommonLetters] = useState<string[]>([]);
  const [slotStopIndex, setSlotStopIndex] = useState<number>(-1);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [isSlotMachineAnimating, setIsSlotMachineAnimating] = useState<boolean>(false);

  // Refs for managing timeouts and state
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const processingRef = useRef<boolean>(false);
  const stageProgressRef = useRef<string | null>(null);

  // Get animation preferences
  const { shouldAnimate } = useAnimationPreferences();

  // Clear all timeouts to prevent memory leaks and unwanted behavior
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Add timeout with tracking for easier cleanup
  const addTimeout = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timeout = setTimeout(() => {
      // Filter out this timeout from the array
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout);
      // Execute callback
      callback();
    }, delay);

    // Add to tracked timeouts
    timeoutsRef.current.push(timeout);
    return timeout;
  }, []);

  // Effect to handle any stuck states - acts as a failsafe
  useEffect(() => {
    // If we're in processing stage for too long, force transition to result
    if (stage === 'processing' && result) {
      const emergencyTimeout = addTimeout(() => {
        console.log('Emergency timeout triggered - forcing result stage');
        setIsSlotMachineAnimating(false);
        setStage('result');
      }, 5000); // 5 second safety timeout

      return () => clearTimeout(emergencyTimeout);
    }
  }, [stage, result, addTimeout]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Memoized name setters with validation feedback
  const handleSetName1 = useCallback((input: string) => {
    setName1(input);
  }, []);

  const handleSetName2 = useCallback((input: string) => {
    setName2(input);
  }, []);

  /**
   * Callback for when the slot machine animation completes
   * This ensures proper synchronization between animation and state
   */
  const onSlotMachineComplete = useCallback(() => {
    console.log('Animation complete callback triggered');
    setIsSlotMachineAnimating(false);
    setStage('result');
    stageProgressRef.current = 'completed';
  }, []);

  /**
   * Validate and process the form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent multiple simultaneous submissions
      if (processingRef.current) {
        console.log('Submission already in progress, ignoring');
        return;
      }

      try {
        // Validate inputs
        const validName1 = nameSchema.parse(name1);
        const validName2 = nameSchema.parse(name2);

        if (validName1.toLowerCase() === validName2.toLowerCase()) {
          toast.error('Names cannot be the same!');
          return;
        }

        // Set processing flag to prevent multiple submissions
        processingRef.current = true;
        stageProgressRef.current = 'started';

        // Clear any existing timeouts
        clearAllTimeouts();

        // Update state to processing
        setStage('processing');
        setResult(null);
        setCommonLetters([]);
        setSlotStopIndex(-1);
        setIsSlotMachineAnimating(false);

        console.log('Processing stage started');

        // Allow UI to update to processing stage
        addTimeout(async () => {
          // Calculate common letters
          const common = findCommonLetters(validName1, validName2);
          setCommonLetters(common);

          // Calculate FLAMES result
          const flamesResult = calculateFlamesResult(validName1, validName2);

          // Small delay for visual processing effect
          addTimeout(() => {
            // Set the result
            setResult(flamesResult);
            console.log('Result calculated:', flamesResult);

            // Record match in background (non-blocking)
            if (flamesResult) {
              const nameToSave1 = anonymous ? null : validName1;
              const nameToSave2 = anonymous ? null : validName2;
              insertMatch(nameToSave1, nameToSave2, flamesResult).catch((error) => {
                console.error(`Failed to record ${anonymous ? 'anonymous ' : ''}match:`, error);
              });
            }

            // Handle animation based on user preferences
            if (shouldAnimate) {
              console.log('Starting animation sequence');
              // CRITICAL: Set animation flag to start the animation
              setIsSlotMachineAnimating(true);
              stageProgressRef.current = 'animating';

              // Safety timeout: if animation doesn't complete naturally, force completion
              addTimeout(() => {
                if (stage === 'processing' && stageProgressRef.current === 'animating') {
                  console.log('Animation safety timeout triggered');
                  onSlotMachineComplete();
                }
              }, 8000);
            } else {
              // Skip animation and proceed directly to result
              console.log('Animation disabled, skipping to result');
              setStage('result');
              stageProgressRef.current = 'completed';
            }

            // Reset processing flag
            processingRef.current = false;
          }, 800);
        }, 300);
      } catch (error) {
        processingRef.current = false;
        stageProgressRef.current = null;

        if (error instanceof z.ZodError) {
          toast.error(error.errors[0].message);
        } else {
          console.error('Unexpected error:', error);
          toast.error('Something went wrong. Please try again.');
        }
      }
    },
    [name1, name2, shouldAnimate, anonymous, stage, clearAllTimeouts, addTimeout, onSlotMachineComplete]
  );

  /**
   * Reset the game state
   */
  const resetGame = useCallback(() => {
    clearAllTimeouts();
    processingRef.current = false;
    stageProgressRef.current = null;

    setName1('');
    setName2('');
    setResult(null);
    setStage('input');
    setCommonLetters([]);
    setSlotStopIndex(-1);
    setIsSlotMachineAnimating(false);
    setAnonymous(false);
  }, [clearAllTimeouts]);

  // Memoize the state object to prevent unnecessary re-renders
  const state = useMemo((): FlamesEngineState => {
    return {
      name1,
      name2,
      result,
      stage,
      commonLetters,
      slotStopIndex,
      anonymous,
      isSlotMachineAnimating,
    };
  }, [name1, name2, result, stage, commonLetters, slotStopIndex, anonymous, isSlotMachineAnimating]);

  // Memoize the actions object to prevent unnecessary re-renders
  const actions = useMemo((): FlamesEngineActions => {
    return {
      setName1: handleSetName1,
      setName2: handleSetName2,
      handleSubmit,
      resetGame,
      setAnonymous,
      onSlotMachineComplete,
    };
  }, [handleSetName1, handleSetName2, handleSubmit, resetGame, setAnonymous, onSlotMachineComplete]);

  return [state, actions];
}
