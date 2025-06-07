import { z } from 'zod';
import { nameSchema } from '../flames.utils';

export function validateNameInput(name: string): string | null {
  try {
    nameSchema.parse(name);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'Invalid name';
  }
}

export function updateCrossedLetters(
  crossed: Set<string>,
  name1: string,
  name2: string,
  letter: string,
  nameIndex: number,
  position: number
): Set<string> {
  const letterKey = `${nameIndex}-${position}-${letter}`;
  const newSet = new Set(crossed);

  if (newSet.has(letterKey)) {
    newSet.delete(letterKey);
    return newSet;
  }

  const otherNameIndex = nameIndex === 1 ? 2 : 1;
  const otherName = otherNameIndex === 1 ? name1 : name2;

  for (let i = 0; i < otherName.length; i++) {
    const otherLetterKey = `${otherNameIndex}-${i}-${otherName[i].toLowerCase()}`;
    if (otherName[i].toLowerCase() === letter && !newSet.has(otherLetterKey)) {
      newSet.add(letterKey);
      newSet.add(otherLetterKey);
      break;
    }
  }

  return newSet;
}
