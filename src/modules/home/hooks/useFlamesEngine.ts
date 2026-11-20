import { usePairingHistory } from '@/hooks/usePairingHistory';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
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
}

interface FlamesEngineActions {
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetGame: () => void;
  onFlamesAnimationComplete: () => void;
}

/**
 * Centralized FLAMES game engine with streamlined stage management
 * Handles all game logic, timing, and state transitions
 */
export function useFlamesEngine(): [FlamesEngineState, FlamesEngineActions] {
  // Core game state
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<FlamesResult>(null);
  const [stage, setStage] = useState<GameStage>('input');
  const [runId, setRunId] = useState<number>(0);
  const [commonLetters, setCommonLetters] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Refs for managing state and preventing race conditions
  const processingRef = useRef<boolean>(false);
  const calculatedDataRef = useRef<{
    result: FlamesResult;
    commonLetters: string[];
    remainingLetters: string[];
  } | null>(null);

  const { addPairing } = usePairingHistory();

  // Update URL params when names change
  const updateUrlParams = useCallback((newName1: string, newName2: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newName1.trim()) params.set('name1', newName1.trim());
    else params.delete('name1');
    if (newName2.trim()) params.set('name2', newName2.trim());
    else params.delete('name2');

    // Use history API directly to avoid Next.js navigation/re-render issues
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

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
    // Only include alphabetic characters (consistent with FLAMES calculation)
    const isLetter = (char: string) => /\p{L}/u.test(char);
    const name1Letters = [...validName1.toLowerCase()].filter(isLetter);
    const name2Letters = [...validName2.toLowerCase()].filter(isLetter);

    // Remove common letters from both names (one occurrence per match)
    const remaining1: string[] = [];
    const remaining2: string[] = [];
    const usedCommon1 = new Map<string, number>();
    const usedCommon2 = new Map<string, number>();

    // Count how many times each common letter appears
    for (const letter of common) {
      const lowerLetter = letter.toLowerCase();
      usedCommon1.set(lowerLetter, (usedCommon1.get(lowerLetter) || 0) + 1);
      usedCommon2.set(lowerLetter, (usedCommon2.get(lowerLetter) || 0) + 1);
    }

    // Filter name1 letters, removing matched occurrences
    for (const letter of name1Letters) {
      const count = usedCommon1.get(letter) || 0;
      if (count > 0) {
        usedCommon1.set(letter, count - 1);
      } else {
        remaining1.push(letter);
      }
    }

    // Filter name2 letters, removing matched occurrences
    for (const letter of name2Letters) {
      const count = usedCommon2.get(letter) || 0;
      if (count > 0) {
        usedCommon2.set(letter, count - 1);
      } else {
        remaining2.push(letter);
      }
    }

    const remainingCombined = [...remaining1, ...remaining2];

    return {
      result: flamesResult,
      commonLetters: common,
      remainingLetters: remainingCombined,
    };
  }, []);

  const onFlamesAnimationComplete = useCallback(() => {
    const game = calculatedDataRef.current;
    if (!game || !processingRef.current) return;

    processingRef.current = false;
    setStage('result');
    setIsProcessing(false);
    // History and badge bookkeeping (localStorage + JSON) is not needed for the
    // reveal itself; run it once the reveal has settled.
    if (game.result) {
      const recorded = { name1, name2, result: game.result };
      const save = () => addPairing(recorded.name1, recorded.name2, recorded.result);
      setTimeout(() => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(save, { timeout: 2000 });
        else save();
      }, 1600);
    }
  }, [addPairing, name1, name2]);

  /**
   * Main form submission handler
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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

        // Calculate all game data immediately
        const gameData = calculateGameData(validName1, validName2);
        calculatedDataRef.current = gameData;
        setName1(validName1);
        setName2(validName2);
        const pathname = window.location.pathname;
        // Native history updates also schedule Next.js router work. The names
        // already live in game state; synchronize the share URL after a frame
        // has painted, and ignore a game that was reset or navigated away from.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (calculatedDataRef.current === gameData && window.location.pathname === pathname) {
              updateUrlParams(validName1, validName2);
            }
          });
        });
        // Make remaining letters available to the processor immediately so counting has the correct value
        setRemainingLetters(gameData.remainingLetters);
        // Provide common letters up-front so the processor doesn't restart mid-animation
        setCommonLetters(gameData.commonLetters);
        // Set result immediately so FlamesProcessor has the correct value from the start
        setResult(gameData.result);

        // Bump runId so processors remount even if names repeat
        setRunId((id) => id + 1);

        // Record the anonymous result once the animation has had the main
        // thread to itself. This is a single small fetch (no SDK).
        if (gameData.result) {
          const recordedResult = gameData.result;
          const record = () => void import('@lib/record-match').then(({ recordMatch }) => recordMatch(recordedResult));
          setTimeout(() => {
            if ('requestIdleCallback' in window) window.requestIdleCallback(record, { timeout: 4000 });
            else record();
          }, 2500);
        }

        // Transition to processing stage with form collapse effect
        setStage('processing');
      } catch (error) {
        // Reset processing state on any error
        processingRef.current = false;
        setIsProcessing(false);

        if (error instanceof z.ZodError) {
          toast.error(error.issues[0]?.message || 'Please check the names and try again.');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      }
    },
    [isProcessing, name1, name2, updateUrlParams, calculateGameData]
  );

  /**
   * Reset the entire game state
   */
  const resetGame = useCallback(() => {
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

    // Clear URL params
    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, []);

  useEffect(
    () => () => {
      calculatedDataRef.current = null;
    },
    []
  );

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
    }),
    [name1, name2, result, stage, runId, commonLetters, remainingLetters, isProcessing]
  );

  const actions = useMemo(
    (): FlamesEngineActions => ({
      setName1: handleSetName1,
      setName2: handleSetName2,
      handleSubmit,
      resetGame,
      onFlamesAnimationComplete,
    }),
    [handleSetName1, handleSetName2, handleSubmit, resetGame, onFlamesAnimationComplete]
  );

  return [state, actions];
}
