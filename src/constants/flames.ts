export enum FlamesResultType {
  FRIEND = 'F',
  LOVE = 'L',
  AFFECTION = 'A',
  MARRIAGE = 'M',
  ENEMY = 'E',
  SIBLING = 'S',
}

export const FLAMES_ORDER = [
  FlamesResultType.FRIEND,
  FlamesResultType.LOVE,
  FlamesResultType.AFFECTION,
  FlamesResultType.MARRIAGE,
  FlamesResultType.ENEMY,
  FlamesResultType.SIBLING,
] as const;

export type FlamesResult = 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
