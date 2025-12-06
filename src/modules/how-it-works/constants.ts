/**
 * Constants used throughout the How It Works feature
 * Extracted to a separate file to optimize for React Fast Refresh
 */

// Example names for demonstration
export const DEMO_NAME1 = 'Naren';
export const DEMO_NAME2 = 'Priya';
export const DEMO_COMMON_LETTERS = ['a', 'r'];
export const DEMO_REMAINING_COUNT = (DEMO_NAME1 + DEMO_NAME2).length - DEMO_COMMON_LETTERS.length * 2;
