import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil } from 'lucide-react';
import NameInput from './components/NameInput';
import LetterGrid from './components/LetterGrid';
import FlamesCounter from './components/FlamesCounter';
import FloatingTools from './components/FloatingTools';
import { calculateFlamesResult } from '../flames.utils';
import { useManualMode } from './hooks/useManualMode';
import { usePreferences } from '../../../hooks/usePreferences';
import type { ManualModeProps } from './types';

export default function ManualMode({ onShare, onClose }: ManualModeProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    state: {
      name1, name2, name1Locked, name2Locked,
      crossedLetters, result, isChalkboard
    },
    handlers: {
      handleNameChange, handleNameLock, handleNameEdit,
      handleLetterCross, handleResult, handleReset,
      toggleStyle
    },
    utils: { calculateRemainingLetters }
  } = useManualMode();
  
  const [{ isDarkTheme }] = usePreferences();

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen p-4 md:p-6 transition-colors duration-300
                ${isChalkboard 
                  ? 'bg-gray-900 bg-chalkboard text-white'
                  : isDarkTheme 
                    ? 'bg-gray-900 bg-paper-dark'
                    : 'bg-white bg-paper-light'
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className={`text-3xl font-handwriting mb-2
                       ${isChalkboard ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
            Manual Mode
          </h1>
          <p className={`text-lg font-handwriting
                      ${isChalkboard ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
            Experience FLAMES the old-school way! ✏️
          </p>
        </div>

        {/* Name Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className={`rounded-xl p-6
                     ${isChalkboard 
                       ? 'bg-gray-800/50' 
                       : 'bg-gray-50 dark:bg-gray-800'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-handwriting
                           ${isChalkboard ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                Cross out common letters
              </h2>
              <div className="flex items-center gap-2">
                <Pencil className={`w-4 h-4 
                                ${isChalkboard ? 'text-gray-300' : 'text-gray-500'}`} />
                <span className={`text-sm font-handwriting
                               ${isChalkboard ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
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
            className={`rounded-xl p-6
                     ${isChalkboard 
                       ? 'bg-gray-800/50' 
                       : 'bg-gray-50 dark:bg-gray-800'}`}
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
};