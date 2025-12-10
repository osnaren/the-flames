import { FlamesResult } from '@shared/utils/resultData';
import { create } from 'zustand';

export type BackgroundVariant = 'default' | 'processing' | 'result';
export type BackgroundSeason =
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'valentine'
  | 'halloween'
  | 'christmas'
  | undefined;
export type BackgroundIntensity = 'low' | 'medium' | 'high';

interface BackgroundState {
  variant: BackgroundVariant;
  result?: FlamesResult;
  season?: BackgroundSeason;
  intensity: BackgroundIntensity;
}

interface BackgroundActions {
  setBackgroundState: (state: Partial<BackgroundState>) => void;
  resetBackground: () => void;
}

const initialState: BackgroundState = {
  variant: 'default',
  result: undefined,
  season: undefined,
  intensity: 'medium',
};

export const useBackgroundStore = create<BackgroundState & BackgroundActions>((set) => ({
  ...initialState,
  setBackgroundState: (newState) => set((state) => ({ ...state, ...newState })),
  resetBackground: () => set(initialState),
}));
