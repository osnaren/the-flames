import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useRef } from 'react';
import { usePreferences } from '../../../hooks/usePreferences';
import FlamesCounter from './components/FlamesCounter';
import FloatingTools from './components/FloatingTools';
import LetterGrid from './components/LetterGrid';
import NameInput from './components/NameInput';
import { useManualMode } from './hooks/useManualMode';
import type { ManualModeProps } from './types';

export default function ManualMode({ onShare, onClose }: ManualModeProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    state: { name1, name2, name1Locked, name2Locked, crossedLetters, result, isChalkboard },
    handlers: {
      handleNameChange,
      handleNameLock,
      handleNameEdit,
      handleLetterCross,
      handleResult,
      handleReset,
      toggleStyle,
    },
    utils: { calculateRemainingLetters },
  } = useManualMode();

  const [{ isDarkTheme }] = usePreferences();

  return (
    <div
      ref={containerRef}
      className={`min-h-screen p-4 transition-colors duration-300 md:p-6 ${
        isChalkboard
          ? 'bg-chalkboard bg-gray-900 text-white'
          : isDarkTheme
            ? 'bg-paper-dark bg-gray-900'
            : 'bg-paper-light bg-white'
      }`}
    >
      {/* Floating Tools */}
      <FloatingTools
        onReset={handleReset}
        onShare={() => result && onShare?.(result)}
        onToggleStyle={toggleStyle}
        canShare={!!result}
        isChalkboard={isChalkboard}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1
            className={`font-handwriting mb-2 text-3xl ${isChalkboard ? 'text-white' : 'text-gray-800 dark:text-white'}`}
          >
            Manual Mode
          </h1>
          <p
            className={`font-handwriting text-lg ${isChalkboard ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Experience FLAMES the old-school way! ✏️
          </p>
        </div>

        {/* Name Inputs */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <NameInput
            value={name1}
            onChange={(value) => handleNameChange(1, value)}
            isLocked={name1Locked}
            onLock={() => handleNameLock(1)}
            onEdit={() => handleNameEdit(1)}
            placeholder="Your name"
            isChalkboard={isChalkboard}
          />
          <NameInput
            value={name2}
            onChange={(value) => handleNameChange(2, value)}
            isLocked={name2Locked}
            onLock={() => handleNameLock(2)}
            onEdit={() => handleNameEdit(2)}
            placeholder="Their name"
            isChalkboard={isChalkboard}
          />
        </div>

        {/* Letter Grid */}
        {name1Locked && name2Locked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 ${isChalkboard ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className={`font-handwriting text-lg ${isChalkboard ? 'text-white' : 'text-gray-800 dark:text-white'}`}
              >
                Cross out common letters
              </h2>
              <div className="flex items-center gap-2">
                <Pencil className={`h-4 w-4 ${isChalkboard ? 'text-gray-300' : 'text-gray-500'}`} />
                <span
                  className={`font-handwriting text-sm ${isChalkboard ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {calculateRemainingLetters()} letters remaining
                </span>
              </div>
            </div>

            <LetterGrid
              name1={name1}
              name2={name2}
              crossedLetters={crossedLetters}
              onLetterClick={handleLetterCross}
              isChalkboard={isChalkboard}
            />
          </motion.div>
        )}

        {/* FLAMES Counter */}
        {name1Locked && name2Locked && calculateRemainingLetters() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 ${isChalkboard ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'}`}
          >
            <FlamesCounter
              remainingLetters={calculateRemainingLetters()}
              onResult={handleResult}
              isChalkboard={isChalkboard}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
