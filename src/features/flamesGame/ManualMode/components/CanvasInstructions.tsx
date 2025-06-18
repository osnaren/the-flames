import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function CanvasInstructions() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="flex w-full flex-col items-center"
    >
      {/* Expanded Instructions Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="border-outline/20 bg-surface/90 mb-3 w-full max-w-4xl overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl sm:rounded-2xl"
          >
            <div className="p-4 sm:p-6">
              <h3 className="text-on-surface mb-4 flex items-center text-lg font-bold sm:text-xl">
                <span className="mr-2">🎨</span>
                Canvas Drawing Instructions
              </h3>

              <div className="text-on-surface-variant grid gap-4 text-sm sm:gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-3 text-base sm:text-lg">✏️</span>
                    <div>
                      <strong className="text-on-surface">Drawing Mode:</strong>
                      <p className="text-xs sm:text-sm">
                        Click and drag to draw over letters. Use smooth strokes to cross out letters during your FLAMES
                        calculation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-base sm:text-lg">🧹</span>
                    <div>
                      <strong className="text-on-surface">Erasing:</strong>
                      <p className="text-xs sm:text-sm">
                        Right-click anywhere to toggle erase mode, or use the Erase button in the toolbar. Erase mode
                        clears drawings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-base sm:text-lg">🔄</span>
                    <div>
                      <strong className="text-on-surface">Clear Canvas:</strong>
                      <p className="text-xs sm:text-sm">
                        Use the Clear button to remove all drawings from the canvas at once.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-3 text-base sm:text-lg">📱</span>
                    <div>
                      <strong className="text-on-surface">Touch Support:</strong>
                      <p className="text-xs sm:text-sm">
                        On mobile devices, tap and drag to draw. Use right-click or erase button to toggle modes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-base sm:text-lg">🎯</span>
                    <div>
                      <strong className="text-on-surface">FLAMES Goal:</strong>
                      <p className="text-xs sm:text-sm">
                        Cross out common letters between names, then eliminate F.L.A.M.E.S letters based on the
                        remaining count.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-base sm:text-lg">📤</span>
                    <div>
                      <strong className="text-on-surface">Save & Share:</strong>
                      <p className="text-xs sm:text-sm">
                        Use the Share button to save your canvas artwork or share it with others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-primary-container/20 bg-primary-container/10 mt-4 rounded-xl border p-3 sm:mt-6 sm:p-4">
                <p className="text-on-surface-variant text-center text-xs sm:text-sm">
                  <strong>💡 Pro Tip:</strong> The canvas adapts to your current theme preference - light or dark mode!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Instructions Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group border-outline/20 bg-surface/90 hover:bg-surface/95 flex w-full max-w-sm items-center justify-center rounded-full border px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:shadow-lg sm:max-w-md sm:rounded-2xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <HelpCircle className="text-on-surface mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5" />
        <span className="text-on-surface text-sm font-medium sm:text-base">
          {isExpanded ? 'Hide Instructions' : 'Show Drawing Instructions'}
        </span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-2 sm:ml-3">
          {isExpanded ? (
            <ChevronUp className="text-on-surface h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <ChevronDown className="text-on-surface h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
