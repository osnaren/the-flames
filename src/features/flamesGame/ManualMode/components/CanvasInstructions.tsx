import { useMediaQuery } from '@hooks/useMediaQuery';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shadcn/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@shadcn/drawer';
import Button from '@ui/Button';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface CanvasInstructionsProps {
  className?: string;
}
// Shared content component for both Dialog and Drawer

const InstructionsContent: React.FC = () => (
  <div className="text-on-surface-variant max-h-[60vh] overflow-y-auto">
    <div className="grid gap-4 text-sm sm:gap-6 md:grid-cols-2">
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
              Right-click anywhere to toggle erase mode, or use the Erase button in the toolbar. Erase mode clears
              drawings.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mr-3 text-base sm:text-lg">🔄</span>
          <div>
            <strong className="text-on-surface">Clear Canvas:</strong>
            <p className="text-xs sm:text-sm">Use the Clear button to remove all drawings from the canvas at once.</p>
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
              Cross out common letters between names, then eliminate F.L.A.M.E.S letters based on the remaining count.
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
);

// Dialog version for desktop
const InstructionsDialog: React.FC<{ isOpen: boolean; onOpenChange: (open: boolean) => void }> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>🎨</span>
            Canvas Drawing Instructions
          </DialogTitle>
          <DialogDescription>Learn how to use the canvas drawing tools for your FLAMES calculation</DialogDescription>
        </DialogHeader>

        <InstructionsContent />

        <div className="flex justify-end pt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Got it
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Drawer version for mobile
const InstructionsDrawer: React.FC<{ isOpen: boolean; onOpenChange: (open: boolean) => void }> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] focus:outline-none">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <span>🎨</span>
            Canvas Drawing Instructions
          </DrawerTitle>
          <DrawerDescription>Learn how to use the canvas drawing tools for your FLAMES calculation</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-8">
          <InstructionsContent />
        </div>

        <div className="border-t px-4 py-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Got it
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default function CanvasInstructions({ className = '' }: CanvasInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`group border-outline/20 bg-surface/90 hover:bg-surface/95 flex items-center justify-center rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 hover:shadow-lg ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <HelpCircle className="text-on-surface h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-on-surface ml-2 text-sm font-medium sm:text-base">Help</span>
      </motion.button>

      {isDesktop ? (
        <InstructionsDialog isOpen={isOpen} onOpenChange={setIsOpen} />
      ) : (
        <InstructionsDrawer isOpen={isOpen} onOpenChange={setIsOpen} />
      )}
    </>
  );
}
