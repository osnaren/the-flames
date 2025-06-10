import { Checkbox } from '@shadcn/checkbox';
import { Input } from '@shadcn/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shadcn/tooltip';
import Button from '@ui/Button';
import { motion } from 'framer-motion';
import { VenetianMask } from 'lucide-react';
import { useRef, useState } from 'react';

interface InputFormProps {
  name1: string;
  name2: string;
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  shouldAnimate: boolean;
  animationsEnabled: boolean;
  anonymous: boolean;
  setAnonymous: (value: boolean) => void;
}

/**
 * Form component for capturing user names
 */
export function InputForm({
  name1,
  name2,
  setName1,
  setName2,
  onSubmit,
  shouldAnimate,
  animationsEnabled: _animationsEnabled,
  anonymous,
  setAnonymous,
}: InputFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <motion.form
      onSubmit={onSubmit}
      className="relative space-y-6 md:space-y-8"
      initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* First Name Input with Enhanced Styling */}
      <motion.div
        className="relative"
        initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldAnimate ? 0.1 : 0, duration: 0.4 }}
      >
        <label
          htmlFor="name1"
          className={`text-on-surface dark:text-on-surface mb-2 block text-sm font-semibold transition-colors duration-200 ${
            focusedField === 'name1' ? 'text-primary dark:text-primary' : ''
          }`}
        >
          Your name
        </label>
        <div className="relative">
          <Input
            id="name1"
            ref={nameInputRef}
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            onFocus={() => setFocusedField('name1')}
            onBlur={() => setFocusedField(null)}
            placeholder="Who are you? 💁"
            className={`bg-surface/90 dark:bg-surface-container/90 border-outline/30 dark:border-outline-variant/30 text-on-surface dark:text-on-surface placeholder:text-on-surface-variant dark:placeholder:text-on-surface-variant hover:border-primary/50 dark:hover:border-primary/50 hover:bg-surface dark:hover:bg-surface-container focus:border-primary dark:focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/20 h-14 w-full rounded-xl border-2 px-4 py-4 text-base transition-all duration-300 outline-none hover:shadow-md focus:scale-[1.02] focus:shadow-lg focus:ring-4 ${focusedField === 'name1' ? 'border-primary dark:border-primary ring-primary/20 dark:ring-primary/20 scale-[1.02] shadow-lg ring-4' : ''} `}
            required
            aria-label="Your name"
            aria-describedby="name1-hint"
          />
          {/* Enhanced focus indicator */}
          {focusedField === 'name1' && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                boxShadow:
                  '0 0 0 3px rgba(var(--color-primary-rgb), 0.2), 0 0 20px rgba(var(--color-primary-rgb), 0.1)',
              }}
            />
          )}
        </div>
        <p id="name1-hint" className="sr-only">
          Enter your first name
        </p>
      </motion.div>

      {/* Second Name Input with Enhanced Styling */}
      <motion.div
        className="relative"
        initial={shouldAnimate ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldAnimate ? 0.2 : 0, duration: 0.4 }}
      >
        <label
          htmlFor="name2"
          className={`text-on-surface dark:text-on-surface mb-2 block text-sm font-semibold transition-colors duration-200 ${
            focusedField === 'name2' ? 'text-primary dark:text-primary' : ''
          }`}
        >
          Their name
        </label>
        <div className="relative">
          <Input
            id="name2"
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            onFocus={() => setFocusedField('name2')}
            onBlur={() => setFocusedField(null)}
            placeholder="Their name? 💘"
            className={`bg-surface/90 dark:bg-surface-container/90 border-outline/30 dark:border-outline-variant/30 text-on-surface dark:text-on-surface placeholder:text-on-surface-variant dark:placeholder:text-on-surface-variant hover:border-primary/50 dark:hover:border-primary/50 hover:bg-surface dark:hover:bg-surface-container focus:border-primary dark:focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/20 h-14 w-full rounded-xl border-2 px-4 py-4 text-base transition-all duration-300 outline-none hover:shadow-md focus:scale-[1.02] focus:shadow-lg focus:ring-4 ${focusedField === 'name2' ? 'border-primary dark:border-primary ring-primary/20 dark:ring-primary/20 scale-[1.02] shadow-lg ring-4' : ''} `}
            required
            aria-label="Their name"
            aria-describedby="name2-hint"
          />
          {/* Enhanced focus indicator */}
          {focusedField === 'name2' && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                boxShadow:
                  '0 0 0 3px rgba(var(--color-primary-rgb), 0.2), 0 0 20px rgba(var(--color-primary-rgb), 0.1)',
              }}
            />
          )}
        </div>
        <p id="name2-hint" className="sr-only">
          Enter their name
        </p>
      </motion.div>

      {/* Enhanced Anonymous Play Checkbox */}
      <motion.div
        className="space-y-1"
        initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldAnimate ? 0.3 : 0, duration: 0.4 }}
      >
        <div className="bg-surface-variant/20 dark:bg-surface-container-highest/20 border-outline/10 hover:bg-surface-variant/30 dark:hover:bg-surface-container-highest/30 flex items-start space-x-3 rounded-lg border p-3 transition-colors duration-200">
          <div className="flex h-5 items-center">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(!!checked)}
              className="mt-0.5"
              aria-describedby="anonymous-description"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="anonymous"
              className="text-on-surface dark:text-on-surface flex cursor-pointer items-center text-sm font-medium"
            >
              <span>Play Anonymously</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-primary dark:text-on-surface-variant dark:hover:text-primary focus:ring-primary/50 ml-2 rounded p-1 transition-colors focus:ring-2 focus:outline-none"
                      aria-label="Info about anonymous play"
                    >
                      <VenetianMask className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-center text-xs">
                      Anonymous mode: We'll only save your result, not your names. 🔒
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <p id="anonymous-description" className="text-on-surface-variant dark:text-on-surface-variant mt-1 text-xs">
              Keep your names private while still contributing to our statistics
            </p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Submit Button */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldAnimate ? 0.4 : 0, duration: 0.4 }}
      >
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={!name1.trim() || !name2.trim() || name1.trim() === name2.trim()}
          className="h-14 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          <motion.span
            className="flex items-center justify-center gap-2"
            whileHover={shouldAnimate ? { scale: 1.05 } : {}}
            whileTap={shouldAnimate ? { scale: 0.95 } : {}}
          >
            FLAME ON! 🔥
            <motion.span
              animate={
                shouldAnimate
                  ? {
                      rotate: [0, 15, -15, 0],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              ✨
            </motion.span>
          </motion.span>
        </Button>
      </motion.div>
    </motion.form>
  );
}

export default InputForm;
