import type confetti from 'canvas-confetti';

/** Confetti is optional decoration; a worker failure must not break the game. */
export async function fireResultConfetti(instance: confetti.CreateTypes, options: confetti.Options): Promise<void> {
  try {
    await instance(options);
  } catch {
    // Some WebViews cannot clone worker messages. Leave the result usable.
  }
}

export function resetResultConfetti(instance: confetti.CreateTypes): void {
  try {
    instance.reset();
  } catch {
    // The host can dispose its worker before React's unmount cleanup.
  }
}
