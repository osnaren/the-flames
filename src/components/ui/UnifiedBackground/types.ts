/**
 * Particle System Types
 */

import { ParticleShape } from '@/themes/seasonal/types';

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  shape: ParticleShape;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  emoji?: string;
}

export interface ParticleSystemConfig {
  enabled: boolean;
  count: number;
  colors: string[];
  shapes: ParticleShape[];
  size: { min: number; max: number };
  speed: { min: number; max: number };
  opacity: { min: number; max: number };
  direction: 'down' | 'up' | 'random' | 'swirl';
  animation: 'float' | 'fall' | 'sparkle' | 'pulse';
}
