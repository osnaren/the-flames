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
      className="absolute bottom-4 left-1/2 z-40 w-full max-w-4xl -translate-x-1/2 px-4"
    >
      {/* Collapsed Instructions Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group border-outline/20 bg-surface/80 hover:bg-surface/90 mx-auto flex w-full max-w-xs items-center justify-center rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <HelpCircle className="text-on-surface mr-3 h-5 w-5" />
        <span className="text-on-surface font-medium">
          {isExpanded ? 'Hide Instructions' : 'Show Drawing Instructions'}
        </span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-3">
          {isExpanded ? (
            <ChevronUp className="text-on-surface h-5 w-5" />
          ) : (
            <ChevronDown className="text-on-surface h-5 w-5" />
          )}
        </motion.div>
      </motion.button>

      {/* Expanded Instructions Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="border-outline/20 bg-surface/80 mt-4 overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl"
          >
            <div className="p-6">
              <h3 className="text-on-surface mb-4 flex items-center text-xl font-bold">
                <span className="mr-2">🎨</span>
                Canvas Drawing Instructions
              </h3>

              <div className="text-on-surface-variant grid gap-6 text-sm md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-3 text-lg">✏️</span>
                    <div>
                      <strong className="text-on-surface">Drawing Mode:</strong>
                      <p>
                        Click and drag to draw over letters. Use smooth strokes to cross out letters during your FLAMES
                        calculation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-lg">🧹</span>
                    <div>
                      <strong className="text-on-surface">Erasing:</strong>
                      <p>
                        Right-click anywhere to toggle erase mode, or use the Erase button in the toolbar. Erase mode
                        clears drawings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-lg">🔄</span>
                    <div>
                      <strong className="text-on-surface">Clear Canvas:</strong>
                      <p>Use the Clear button to remove all drawings from the canvas at once.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-3 text-lg">📱</span>
                    <div>
                      <strong className="text-on-surface">Touch Support:</strong>
                      <p>On mobile devices, tap and drag to draw. Long press for context menu options.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-lg">🎯</span>
                    <div>
                      <strong className="text-on-surface">FLAMES Goal:</strong>
                      <p>
                        Cross out common letters between names, then eliminate F.L.A.M.E.S letters based on the
                        remaining count.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mr-3 text-lg">📤</span>
                    <div>
                      <strong className="text-on-surface">Save & Share:</strong>
                      <p>Use the Share button to save your canvas artwork or share it with others.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-primary-container/20 bg-primary-container/10 mt-6 rounded-xl border p-4">
                <p className="text-on-surface-variant text-center text-sm">
                  <strong>💡 Pro Tip:</strong> The canvas adapts to your current theme preference - light or dark mode!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
