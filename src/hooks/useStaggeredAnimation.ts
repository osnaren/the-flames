import { useCallback, useState } from 'react';
import { useTimers } from './useTimers';

export interface StaggeredStage {
  [key: string]: boolean;
}

export interface StaggeredAnimationConfig {
  stages: string[];
  delays: number[];
  shouldAnimate?: boolean;
}

/**
 * Custom hook for managing staggered animations
 * Provides a clean way to orchestrate multiple animation stages with proper timing
 */
export function useStaggeredAnimation<T extends StaggeredStage>({
  stages,
  delays,
  shouldAnimate = true,
}: StaggeredAnimationConfig) {
  const { addTimeout, clearAll } = useTimers();

  // Initialize all stages as false
  const initialStages = stages.reduce((acc, stage) => ({ ...acc, [stage]: false }), {} as T);
  const [stageCompleted, setStageCompleted] = useState<T>(initialStages);
  const [hasStarted, setHasStarted] = useState(false);

  // Start the staggered animation sequence
  const startAnimation = useCallback(() => {
    if (!shouldAnimate) {
      // If animations are disabled, complete all stages immediately
      const allCompleted = stages.reduce((acc, stage) => ({ ...acc, [stage]: true }), {} as T);
      setStageCompleted(allCompleted);
      setHasStarted(true);
      return;
    }

    // Clear any existing timers
    clearAll();

    // Reset stages
    setStageCompleted(initialStages);
    setHasStarted(true);

    // Schedule each stage with its corresponding delay
    stages.forEach((stage, index) => {
      const delay = delays[index] || index * 300; // Default 300ms between stages
      addTimeout(() => {
        setStageCompleted((prev) => ({ ...prev, [stage]: true }) as T);
      }, delay);
    });
  }, [shouldAnimate, stages, delays, initialStages, addTimeout, clearAll]);

  // Reset animation to initial state
  const resetAnimation = useCallback(() => {
    clearAll();
    setStageCompleted(initialStages);
    setHasStarted(false);
  }, [clearAll, initialStages]);

  // Check if a specific stage is completed
  const isStageCompleted = useCallback(
    (stage: string) => {
      return stageCompleted[stage] || false;
    },
    [stageCompleted]
  );

  // Check if all stages are completed
  const isComplete = useCallback(() => {
    return stages.every((stage) => stageCompleted[stage]);
  }, [stages, stageCompleted]);

  return {
    stageCompleted,
    hasStarted,
    startAnimation,
    resetAnimation,
    isStageCompleted,
    isComplete,
  };
}
