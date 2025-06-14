import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { usePairingHistory } from '@/hooks/usePairingHistory';
import { useTimers } from '@/hooks/useTimers';
import { insertMatch } from '@lib/supabase';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { FlamesResult, GameStage } from './flames.types';
import { calculateFlamesResult, findCommonLetters, nameSchema } from './flames.utils';

interface FlamesEngineState {
  name1: string;
  name2: string;
  result: FlamesResult;
  stage: GameStage;
  commonLetters: string[];
  remainingLetters: string[];
  anonymous: boolean;
  isProcessing: boolean;
  stageProgress: {
    commonLettersRevealed: boolean;
    flamesAnimationStarted: boolean;
    flamesAnimationComplete: boolean;
    resultRevealed: boolean;
  };
  newlyUnlockedBadges: any[];
}

interface FlamesEngineActions {
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetGame: () => void;
  setAnonymous: (value: boolean) => void;
  onCommonLettersComplete: () => void;
  onFlamesAnimationComplete: () => void;
  onResultReveal: () => void;
}

// Centralized timing configuration
const STAGE_TIMINGS = {
  FORM_COLLAPSE: 800, // Time for input form to collapse
  COMMON_LETTERS_REVEAL: 1200, // Time to reveal common letters
  COMMON_LETTERS_STRIKE: 2000, // Time to strike through common letters
  FLAMES_ANIMATION_START: 500, // Delay before FLAMES animation starts
  FLAMES_ANIMATION_DURATION: 4000, // Duration of FLAMES counting animation
  RESULT_REVEAL_DELAY: 800, // Delay before showing final result
} as const;

/**
 * Centralized FLAMES game engine with streamlined stage management
 * Handles all game logic, timing, and state transitions
 */
export function useFlamesEngine(): [FlamesEngineState, FlamesEngineActions] {
  const [searchParams, setSearchParams] = useSearchParams();

  // Core game state
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<FlamesResult>(null);
  const [stage, setStage] = useState<GameStage>('input');
  const [commonLetters, setCommonLetters] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stage progress tracking
  const [stageProgress, setStageProgress] = useState({
    commonLettersRevealed: false,
    flamesAnimationStarted: false,
    flamesAnimationComplete: false,
    resultRevealed: false,
  });

  // Refs for managing state and preventing race conditions
  const processingRef = useRef<boolean>(false);
  const calculatedDataRef = useRef<{
    result: FlamesResult;
    commonLetters: string[];
    remainingLetters: string[];
  } | null>(null);

  // Get animation preferences and timer utilities
  const { shouldAnimate } = useAnimationPreferences();
  const { addTimeout, clearAll } = useTimers();

  // Pairing history and badges
  const { addPairing, getNewlyUnlockedBadges } = usePairingHistory();

  // Initialize from URL params
  useEffect(() => {
    const urlName1 = searchParams.get('name1');
    const urlName2 = searchParams.get('name2');

    if (urlName1) setName1(decodeURIComponent(urlName1));
    if (urlName2) setName2(decodeURIComponent(urlName2));
  }, [searchParams]);

  // Update URL params when names change
  const updateUrlParams = useCallback(
    (newName1: string, newName2: string) => {
      const params = new URLSearchParams();
      if (newName1.trim()) params.set('name1', encodeURIComponent(newName1.trim()));
      if (newName2.trim()) params.set('name2', encodeURIComponent(newName2.trim()));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Memoized name setters
  const handleSetName1 = useCallback((input: string) => {
    setName1(input);
  }, []);

  const handleSetName2 = useCallback((input: string) => {
    setName2(input);
  }, []);

  /**
   * Instant calculation of all game data
   * This happens immediately when form is submitted
   */
  const calculateGameData = useCallback((validName1: string, validName2: string) => {
    const common = findCommonLetters(validName1, validName2);
    const flamesResult = calculateFlamesResult(validName1, validName2);

    // Calculate remaining letters after removing common ones
    const name1Letters = validName1.toLowerCase().split('');
    const name2Letters = validName2.toLowerCase().split('');
    const commonSet = new Set(common.map((l) => l.toLowerCase()));

    // Remove common letters from both names
    const remaining1 = name1Letters.filter((letter) => !commonSet.has(letter));
    const remaining2 = name2Letters.filter((letter) => !commonSet.has(letter));
    const remainingCombined = [...remaining1, ...remaining2];

    return {
      result: flamesResult,
      commonLetters: common,
      remainingLetters: remainingCombined,
    };
  }, []);

  /**
   * Centralized stage progression with proper timing
   */
  const progressToNextStage = useCallback(() => {
    if (!calculatedDataRef.current) return;

    const {
      result: gameResult,
      commonLetters: gameCommon,
      remainingLetters: gameRemaining,
    } = calculatedDataRef.current;

    // Stage 1: Reveal common letters
    if (!stageProgress.commonLettersRevealed) {
      setCommonLetters(gameCommon);
      setStageProgress((prev) => ({ ...prev, commonLettersRevealed: true }));

      // Progress to FLAMES animation after common letters are processed
      addTimeout(
        () => {
          setStageProgress((prev) => ({ ...prev, flamesAnimationStarted: true }));
          setRemainingLetters(gameRemaining);
        },
        shouldAnimate ? STAGE_TIMINGS.COMMON_LETTERS_STRIKE : 100
      );

      return;
    }

    // Stage 2: Complete FLAMES animation
    if (stageProgress.flamesAnimationStarted && !stageProgress.flamesAnimationComplete) {
      setStageProgress((prev) => ({ ...prev, flamesAnimationComplete: true }));
      setResult(gameResult);

      // Add to pairing history and check for badges
      if (gameResult) {
        addPairing(name1, name2, gameResult, anonymous);
      }

      // Progress to result reveal
      addTimeout(
        () => {
          setStageProgress((prev) => ({ ...prev, resultRevealed: true }));
          setStage('result');
          setIsProcessing(false);
        },
        shouldAnimate ? STAGE_TIMINGS.RESULT_REVEAL_DELAY : 100
      );

      return;
    }
  }, [stageProgress, shouldAnimate, addTimeout, name1, name2, anonymous, addPairing]);

  /**
   * Stage completion callbacks
   */
  const onCommonLettersComplete = useCallback(() => {
    progressToNextStage();
  }, [progressToNextStage]);

  const onFlamesAnimationComplete = useCallback(() => {
    progressToNextStage();
  }, [progressToNextStage]);

  const onResultReveal = useCallback(() => {
    // Final stage - everything is complete
    console.log('Game sequence complete');
  }, []);

  /**
   * Main form submission handler
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent multiple submissions
      if (processingRef.current) return;

      try {
        // Validate inputs
        const validName1 = nameSchema.parse(name1);
        const validName2 = nameSchema.parse(name2);

        if (validName1.toLowerCase() === validName2.toLowerCase()) {
          toast.error('Names cannot be the same!');
          return;
        }

        // Set processing state
        processingRef.current = true;
        setIsProcessing(true);
        clearAll();

        // Update URL params
        updateUrlParams(validName1, validName2);

        // INSTANT CALCULATION - All game logic happens immediately
        const gameData = calculateGameData(validName1, validName2);
        calculatedDataRef.current = gameData;

        console.log('Game data calculated instantly:', gameData);

        // Record match in background (non-blocking)
        if (gameData.result) {
          const nameToSave1 = anonymous ? null : validName1;
          const nameToSave2 = anonymous ? null : validName2;
          insertMatch(nameToSave1, nameToSave2, gameData.result).catch((error) => {
            console.error(`Failed to record ${anonymous ? 'anonymous ' : ''}match:`, error);
          });
        }

        // Transition to processing stage with form collapse effect
        setStage('processing');

        // Reset stage progress
        setStageProgress({
          commonLettersRevealed: false,
          flamesAnimationStarted: false,
          flamesAnimationComplete: false,
          resultRevealed: false,
        });

        // Start the staged animation sequence
        addTimeout(
          () => {
            progressToNextStage();
          },
          shouldAnimate ? STAGE_TIMINGS.FORM_COLLAPSE : 100
        );
      } catch (error) {
        processingRef.current = false;
        setIsProcessing(false);

        if (error instanceof z.ZodError) {
          toast.error(error.errors[0].message);
        } else {
          console.error('Unexpected error:', error);
          toast.error('Something went wrong. Please try again.');
        }
      }
    },
    [
      name1,
      name2,
      anonymous,
      shouldAnimate,
      clearAll,
      addTimeout,
      updateUrlParams,
      calculateGameData,
      progressToNextStage,
    ]
  );

  /**
   * Reset the entire game state
   */
  const resetGame = useCallback(() => {
    clearAll();
    processingRef.current = false;
    calculatedDataRef.current = null;

    setName1('');
    setName2('');
    setResult(null);
    setStage('input');
    setCommonLetters([]);
    setRemainingLetters([]);
    setIsProcessing(false);
    setAnonymous(false);
    setStageProgress({
      commonLettersRevealed: false,
      flamesAnimationStarted: false,
      flamesAnimationComplete: false,
      resultRevealed: false,
    });

    // Clear URL params
    setSearchParams({}, { replace: true });
  }, [clearAll, setSearchParams]);

  // Safety timeout to prevent getting stuck
  useEffect(() => {
    if (isProcessing && stage === 'processing') {
      const safetyTimeout = addTimeout(() => {
        console.log('Safety timeout triggered - forcing completion');
        if (calculatedDataRef.current) {
          setResult(calculatedDataRef.current.result);
          setStage('result');
          setIsProcessing(false);
          setStageProgress((prev) => ({ ...prev, resultRevealed: true }));
        }
      }, 10000); // 10 second safety net

      return () => clearTimeout(safetyTimeout);
    }
  }, [isProcessing, stage, addTimeout]);

  // Memoize state and actions to prevent unnecessary re-renders
  const state = useMemo(
    (): FlamesEngineState => ({
      name1,
      name2,
      result,
      stage,
      commonLetters,
      remainingLetters,
      anonymous,
      isProcessing,
      stageProgress,
      newlyUnlockedBadges: getNewlyUnlockedBadges(),
    }),
    [
      name1,
      name2,
      result,
      stage,
      commonLetters,
      remainingLetters,
      anonymous,
      isProcessing,
      stageProgress,
      getNewlyUnlockedBadges,
    ]
  );

  const actions = useMemo(
    (): FlamesEngineActions => ({
      setName1: handleSetName1,
      setName2: handleSetName2,
      handleSubmit,
      resetGame,
      setAnonymous,
      onCommonLettersComplete,
      onFlamesAnimationComplete,
      onResultReveal,
    }),
    [
      handleSetName1,
      handleSetName2,
      handleSubmit,
      resetGame,
      setAnonymous,
      onCommonLettersComplete,
      onFlamesAnimationComplete,
      onResultReveal,
    ]
  );

  return [state, actions];
}
