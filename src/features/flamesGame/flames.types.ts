/**
 * FLAMES Game Type Definitions
 */
import { FlamesResult as StrictFlamesResult } from '@/constants/flames';
import React from 'react';

export type FlamesResult = StrictFlamesResult | null;
export type NonNullFlamesResult = StrictFlamesResult;

export type GameStage = 'input' | 'processing' | 'result';

export interface ResultData {
  text: string;
  icon: React.ElementType;
  color: string;
  onColor: string;
  glowColor: string;
  confetti: {
    colors: string[];
    emojis: string[];
    strength: number;
    duration: number;
    spread: number;
  };
  emoji: string;
  particleCount: number;
  accessibilityLabel: string;
  quote: string;
  endText: string;
}

export interface ResultDataMap {
  F: ResultData;
  L: ResultData;
  M: ResultData;
  A: ResultData;
  E: ResultData;
  S: ResultData;
}
