/**
 * UnifiedBackground Module
 *
 * Modular architecture for seasonal theme backgrounds:
 * - UnifiedBackground: Main component orchestrator
 * - BackgroundEffects: Gradient orbs and ambient effects
 * - useParticleSystem: Particle creation and animation logic
 * - shapes: Canvas drawing functions for particles
 * - types: Type definitions
 */

export { default } from './UnifiedBackground';
export { default as BackgroundEffects } from './BackgroundEffects';
export { useParticleSystem } from './useParticleSystem';
export * from './shapes';
export * from './types';
