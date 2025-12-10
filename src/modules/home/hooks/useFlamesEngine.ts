import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { usePairingHistory } from '@/hooks/usePairingHistory';
import { useTimers } from '@/hooks/useTimers';
import { getUserCountry, insertMatch } from '@lib/supabase';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { STAGE_TIMINGS } from '../constants';
import type { FlamesResult, GameStage } from '../types';
import { calculateFlamesResult, findCommonLetters, nameSchema } from '../utils';

interface FlamesEngineState {
  name1: string;
  name2: string;
  result: FlamesResult;
  stage: GameStage;
  runId: number;
  commonLetters: string[];
  remainingLetters: string[];
  isProcessing: boolean;
  stageProgress: {
    commonLettersRevealed: boolean;
    flamesAnimationStarted: boolean;
    flamesAnimationComplete: boolean;
    resultRevealed: boolean;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newlyUnlockedBadges: any[];
}

interface FlamesEngineActions {
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetGame: () => void;
  resetProcessingState: () => void;
  onCommonLettersComplete: () => void;
  onFlamesAnimationComplete: () => void;
  onResultReveal: () => void;
}

/**
 * Centralized FLAMES game engine with streamlined stage management
 * Handles all game logic, timing, and state transitions
 */
export function useFlamesEngine(): [FlamesEngineState, FlamesEngineActions] {
  const searchParams = useSearchParams();

  // Core game state
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<FlamesResult>(null);
  const [stage, setStage] = useState<GameStage>('input');
  const [runId, setRunId] = useState<number>(0);
  const [commonLetters, setCommonLetters] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);

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

  // Fetch user country on mount
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const country = await getUserCountry();
        setUserCountry(country);
      } catch {
        // Silent failure - country detection is non-critical
      }
    };
    fetchCountry();
  }, []);

  // Initialize from URL params
  useEffect(() => {
    // Guard against SSR or missing searchParams
    if (typeof window === 'undefined' || !searchParams) return;

    const urlName1 = searchParams.get('name1');
    const urlName2 = searchParams.get('name2');

    if (urlName1) {
      if (urlName1 !== name1) {
        setName1(urlName1);
      }
    }
    if (urlName2) {
      if (urlName2 !== name2) {
        setName2(urlName2);
      }
    }
    // Only run on mount and when searchParams changes, not when names change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL params when names change
  const updateUrlParams = useCallback(
    (newName1: string, newName2: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (newName1.trim()) params.set('name1', newName1.trim());
      else params.delete('name1');
      if (newName2.trim()) params.set('name2', newName2.trim());
      else params.delete('name2');

      // Use history API directly to avoid Next.js navigation/re-render issues
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    },
    [searchParams]
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

    const { result: gameResult } = calculatedDataRef.current;

    // Stage 1: Reveal common letters
    if (!stageProgress.commonLettersRevealed) {
      setStageProgress((prev) => ({ ...prev, commonLettersRevealed: true }));

      // The common letters will stay visible, but we'll start the FLAMES animation after a delay
      addTimeout(
        () => {
          setStageProgress((prev) => ({ ...prev, flamesAnimationStarted: true }));
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
        addPairing(name1, name2, gameResult);
      }

      // Give some time to see the final FLAMES letter before moving to result stage
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
  }, [stageProgress, shouldAnimate, addTimeout, name1, name2, addPairing]);

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
    // Final stage complete
  }, []);

  /**
   * Main form submission handler
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent multiple submissions
      if (processingRef.current || isProcessing) {
        return;
      }

      try {
        // Validate inputs first
        const validName1 = nameSchema.parse(name1.trim());
        const validName2 = nameSchema.parse(name2.trim());

        if (validName1.toLowerCase() === validName2.toLowerCase()) {
          toast.error('Names cannot be the same!');
          return;
        }

        // Set processing state immediately after validation passes
        processingRef.current = true;
        setIsProcessing(true);
        clearAll();

        // Update URL params
        updateUrlParams(validName1, validName2);

        // Calculate all game data immediately
        const gameData = calculateGameData(validName1, validName2);
        calculatedDataRef.current = gameData;
        // Make remaining letters available to the processor immediately so counting has the correct value
        setRemainingLetters(gameData.remainingLetters);
        // Provide common letters up-front so the processor doesn't restart mid-animation
        setCommonLetters(gameData.commonLetters);

        // Bump runId so processors remount even if names repeat
        setRunId((id) => id + 1);

        // Record match in background (non-blocking)
        if (gameData.result) {
          insertMatch(gameData.result, userCountry || undefined).catch(() => {
            // Silent failure - match recording is non-critical
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
        // Reset processing state on any error
        processingRef.current = false;
        setIsProcessing(false);

        // Clear any pending timeouts
        clearAll();

        if (error instanceof z.ZodError) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toast.error((error as any).errors[0].message);
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      }
    },
    [
      isProcessing,
      name1,
      name2,
      clearAll,
      updateUrlParams,
      calculateGameData,
      addTimeout,
      shouldAnimate,
      userCountry,
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
    setRunId(0);
    setCommonLetters([]);
    setRemainingLetters([]);
    setIsProcessing(false);
    setStageProgress({
      commonLettersRevealed: false,
      flamesAnimationStarted: false,
      flamesAnimationComplete: false,
      resultRevealed: false,
    });

    // Clear URL params
    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [clearAll]);

  /**
   * Force reset processing state - useful for when form validation fails
   */
  const resetProcessingState = useCallback(() => {
    processingRef.current = false;
    setIsProcessing(false);
    clearAll();
  }, [clearAll]);

  // Safety timeout to prevent getting stuck
  useEffect(() => {
    if (isProcessing && stage === 'processing') {
      const safetyTimeout = addTimeout(() => {
        if (calculatedDataRef.current) {
          setResult(calculatedDataRef.current.result);
          setStage('result');
          setIsProcessing(false);
          setStageProgress((prev) => ({ ...prev, resultRevealed: true }));
        }
      }, 20000); // 20 second safety net

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
      runId,
      commonLetters,
      remainingLetters,
      isProcessing,
      stageProgress,
      newlyUnlockedBadges: getNewlyUnlockedBadges(),
    }),
    [
      name1,
      name2,
      result,
      stage,
      runId,
      commonLetters,
      remainingLetters,
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
      resetProcessingState,
      onCommonLettersComplete,
      onFlamesAnimationComplete,
      onResultReveal,
    }),
    [
      handleSetName1,
      handleSetName2,
      handleSubmit,
      resetGame,
      resetProcessingState,
      onCommonLettersComplete,
      onFlamesAnimationComplete,
      onResultReveal,
    ]
  );

  return [state, actions];
}
