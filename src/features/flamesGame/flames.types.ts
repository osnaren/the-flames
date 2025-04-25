/**
 * FLAMES Game Type Definitions
 */
import React from 'react';

export type FlamesResult = 'F' | 'L' | 'A' | 'M' | 'E' | 'S' | null;
export type GameStage = 'input' | 'processing' | 'result';

export interface ResultInfo {
  text: string;
  icon: React.ElementType;
  color: string;
  quote: string;
}

export interface ResultMeaningsMap {
  F: ResultInfo;
  L: ResultInfo;
  M: ResultInfo;
  A: ResultInfo;
  E: ResultInfo;
  S: ResultInfo;
}