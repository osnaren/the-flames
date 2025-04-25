import { useState, useCallback } from 'react';
import { FlamesResult } from '../../flames.types';
import { nameSchema } from '../../flames.utils';
import { ManualModeState } from '../types';
import { z } from 'zod';
import toast from 'react-hot-toast';

export function useManualMode() {
  const [state, setState] = useState<ManualModeState>({
    name1: '',
    name2: '',
    name1Locked: false,
    name2Locked: false,
    crossedLetters: new Set<string>(),
    result: null,
    isChalkboard: false
  });

  const validateName = useCallback((name: string): string | null => {
    try {
      nameSchema.parse(name);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return 'Invalid name';
    }
  }, []);

  const handleNameChange = useCallback((nameNumber: 1 | 2, value: string) => {
    setState(prev => ({
      ...prev,
      [nameNumber === 1 ? 'name1' : 'name2']: value
    }));
  }, []);

  const handleNameLock = useCallback((nameNumber: 1 | 2) => {
    setState(prev => {
      const name = nameNumber === 1 ? prev.name1 : prev.name2;
      const error = validateName(name);
      
      if (error) {
        toast.error(error);
        return prev;
      }

      return {
        ...prev,
        [nameNumber === 1 ? 'name1Locked' : 'name2Locked']: true
      };
    });
  }, [validateName]);

  const handleNameEdit = useCallback((nameNumber: 1 | 2) => {
    setState(prev => ({
      ...prev,
      [nameNumber === 1 ? 'name1Locked' : 'name2Locked']: false,
      crossedLetters: new Set<string>(),
      result: null
    }));
  }, []);

  const handleLetterCross = useCallback((letter: string, nameIndex: number, position: number) => {
    setState(prev => {
      if (!prev.name1Locked || !prev.name2Locked) return prev;

      const letterKey = `${nameIndex}-${position}-${letter}`;
      const newCrossedLetters = new Set(prev.crossedLetters);

      if (newCrossedLetters.has(letterKey)) {
        newCrossedLetters.delete(letterKey);
      } else {
        // Find matching letter in other name that isn't crossed yet
        const otherNameIndex = nameIndex === 1 ? 2 : 1;
        const otherName = otherNameIndex === 1 ? prev.name1 : prev.name2;
        
        for (let i = 0; i < otherName.length; i++) {
          const otherLetterKey = `${otherNameIndex}-${i}-${otherName[i].toLowerCase()}`;
          if (otherName[i].toLowerCase() === letter && !newCrossedLetters.has(otherLetterKey)) {
            newCrossedLetters.add(letterKey);
            newCrossedLetters.add(otherLetterKey);
            break;
          }
        }
      }

      return {
        ...prev,
        crossedLetters: newCrossedLetters
      };
    });
  }, []);

  const handleResult = useCallback((result: FlamesResult) => {
    setState(prev => ({ ...prev, result }));
  }, []);

  const handleReset = useCallback(() => {
    setState({
      name1: '',
      name2: '',
      name1Locked: false,
      name2Locked: false,
      crossedLetters: new Set<string>(),
      result: null,
      isChalkboard: false
    });
  }, []);

  const toggleStyle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isChalkboard: !prev.isChalkboard
    }));
  }, []);

  const calculateRemainingLetters = useCallback(() => {
    const { name1, name2, crossedLetters } = state;
    if (!name1 || !name2) return 0;
    
    const total = name1.length + name2.length - crossedLetters.size;
    return total;
  }, [state]);

  return {
    state,
    handlers: {
      handleNameChange,
      handleNameLock,
      handleNameEdit,
      handleLetterCross,
      handleResult,
      handleReset,
      toggleStyle
    },
    utils: {
      calculateRemainingLetters,
      validateName
    }
  };
}