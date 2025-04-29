import { Checkbox } from '@shadcn/checkbox';
import { Input } from '@shadcn/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shadcn/tooltip';
import Button from '@ui/Button';
import { motion } from 'framer-motion';
import { VenetianMask } from 'lucide-react';
import { useRef } from 'react';

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

  return (
    <motion.form
      onSubmit={onSubmit}
      className="relative space-y-6"
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration')) || 0.3,
      }}
    >
      <div className="mb-4">
        <label htmlFor="name1" className="sr-only">
          Your name
        </label>
        <Input
          id="name1"
          ref={nameInputRef}
          type="text"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="Who are you? 💁"
          className="border-primary-container hover:border-tertiary-container focus:ring-primary h-12 w-full rounded-lg border px-4 py-3.5 transition-all duration-200 outline-none focus:scale-[1.01] focus:border-orange-500 focus:ring-2"
          required
          aria-label="Your name"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="name2" className="sr-only">
          Their name
        </label>
        <Input
          id="name2"
          type="text"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="Their name? 💘"
          className="border-primary-container hover:border-tertiary-container focus:ring-primary h-12 w-full rounded-lg border px-4 py-3.5 transition-all duration-200 outline-none focus:scale-[1.01] focus:border-orange-500 focus:ring-2"
          required
          aria-label="Their name"
        />
      </div>

      {/* Anonymous play checkbox */}
      <div className="mb-4 flex items-start">
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(!!checked)}
              className="mr-2"
              aria-describedby="anonymous-description"
            />
          </div>
          <div className="ml-1">
            <label htmlFor="anonymous" className="text-primary flex items-center text-sm font-medium">
              <span>Play Anonymously</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-primary-container hover:text-primary ml-1 transition-colors"
                      aria-label="Info about anonymous play"
                    >
                      <VenetianMask className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Anonymous mode: We'll only save your result, not your names. 🔒</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!name1.trim() || !name2.trim() || name1.trim() === name2.trim()}
      >
        FLAME ON! 🔥
      </Button>
    </motion.form>
  );
}

export default InputForm;
