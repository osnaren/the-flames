import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { FlamesResult } from '../../flames.types';
import { ManualModeState } from '../types';
import { updateCrossedLetters, validateNameInput } from '../utils';

export function useManualMode() {
  const [state, setState] = useState<ManualModeState>({
    name1: '',
    name2: '',
    name1Locked: false,
    name2Locked: false,
    crossedLetters: new Set<string>(),
    result: null,
    isChalkboard: false,
  });

  const handleNameChange = useCallback((nameNumber: 1 | 2, value: string) => {
    setState((prev) => ({
      ...prev,
      [nameNumber === 1 ? 'name1' : 'name2']: value,
    }));
  }, []);

  const handleNameLock = useCallback(
    (nameNumber: 1 | 2) => {
      setState((prev) => {
        const name = nameNumber === 1 ? prev.name1 : prev.name2;
        const error = validateNameInput(name);

        if (error) {
          toast.error(error);
          return prev;
        }

        return {
          ...prev,
          [nameNumber === 1 ? 'name1Locked' : 'name2Locked']: true,
        };
      });
    },
    [validateNameInput]
  );

  const handleNameEdit = useCallback((nameNumber: 1 | 2) => {
    setState((prev) => ({
      ...prev,
      [nameNumber === 1 ? 'name1Locked' : 'name2Locked']: false,
      crossedLetters: new Set<string>(),
      result: null,
    }));
  }, []);

  const handleLetterCross = useCallback((letter: string, nameIndex: number, position: number) => {
    setState((prev) => {
      if (!prev.name1Locked || !prev.name2Locked) return prev;

      const updated = updateCrossedLetters(prev.crossedLetters, prev.name1, prev.name2, letter, nameIndex, position);

      return {
        ...prev,
        crossedLetters: updated,
      };
    });
  }, []);

  const handleResult = useCallback((result: FlamesResult) => {
    setState((prev) => ({ ...prev, result }));
  }, []);

  const handleReset = useCallback(() => {
    setState({
      name1: '',
      name2: '',
      name1Locked: false,
      name2Locked: false,
      crossedLetters: new Set<string>(),
      result: null,
      isChalkboard: false,
    });
  }, []);

  const toggleStyle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isChalkboard: !prev.isChalkboard,
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
      toggleStyle,
    },
    utils: {
      calculateRemainingLetters,
      validateName: validateNameInput,
    },
  };
}
