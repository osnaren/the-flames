import { useGameIntegration } from '@/hooks/useGameIntegration';
import { validateFlamesInput, validateName } from '@/utils/validation';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import type { GameStage } from '../../types';

interface InputFormProps {
  name1: string;
  name2: string;
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  shouldAnimate: boolean;
  stage: GameStage;
  isCollapsing?: boolean;
  isProcessing?: boolean;
}

interface FormErrors {
  name1?: string[];
  name2?: string[];
  general?: string[];
}

/**
 * Render the FLAMES input form for two names, including validation, focus visuals, and submission handling.
 *
 * Calls the integration's `formSubmit()` before invoking the provided `onSubmit` when both names pass validation.
 * Plays a 'pop' sound when either input receives focus. Manages and displays field-specific and general validation errors,
 * disables interaction while `isProcessing` is true, and provides animated UI affordances when `shouldAnimate` is enabled.
 *
 * @returns The component's JSX element (the complete input form).
 */
function InputFormComponent({
  name1,
  name2,
  setName1,
  setName2,
  onSubmit,
  shouldAnimate,
  isProcessing = false,
}: InputFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<'name1' | 'name2' | null>(null);
  const { formSubmit, sound } = useGameIntegration();

  // Individual field validation
  const validateField = useCallback((fieldName: 'name1' | 'name2', value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
      return;
    }

    const result = validateName(value);
    if (!result.isValid) {
      setErrors((prev) => ({ ...prev, [fieldName]: result.errors }));
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  }, []);

  // Cross-field validation
  const validateCrossFields = useCallback(() => {
    if (!name1.trim() || !name2.trim()) {
      setErrors((prev) => ({ ...prev, general: undefined }));
      return;
    }

    const result = validateFlamesInput(name1, name2);
    if (result.errors.general?.length) {
      setErrors((prev) => ({ ...prev, general: result.errors.general }));
    } else {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  }, [name1, name2]);

  // Input handlers
  const handleName1Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName1(e.target.value);
      setErrors((prev) => ({ ...prev, name1: undefined, general: undefined }));
    },
    [setName1]
  );

  const handleName2Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName2(e.target.value);
      setErrors((prev) => ({ ...prev, name2: undefined, general: undefined }));
    },
    [setName2]
  );

  const handleBlur = useCallback(
    (field: 'name1' | 'name2') => {
      setFocusedField(null);
      const value = field === 'name1' ? name1 : name2;
      validateField(field, value);
      if (name1.trim() && name2.trim()) {
        setTimeout(() => validateCrossFields(), 50);
      }
    },
    [name1, name2, validateField, validateCrossFields]
  );

  // Form validation state
  const isFormValid = useMemo(() => {
    const hasErrors = Boolean(errors.name1?.length || errors.name2?.length || errors.general?.length);
    return name1.trim() && name2.trim() && !hasErrors;
  }, [name1, name2, errors]);

  // Form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isProcessing) return;

      const name1Result = validateName(name1);
      const name2Result = validateName(name2);
      const combinedResult = validateFlamesInput(name1, name2);

      const validationErrors: FormErrors = {
        name1: name1Result.isValid ? undefined : name1Result.errors,
        name2: name2Result.isValid ? undefined : name2Result.errors,
        general: combinedResult.errors.general,
      };

      setErrors(validationErrors);

      if (name1Result.isValid && name2Result.isValid && combinedResult.isValid) {
        formSubmit();
        onSubmit(e);
      }
    },
    [onSubmit, isProcessing, name1, name2, formSubmit]
  );

  return (
    <motion.div
      className="relative mx-auto w-full max-w-lg"
      initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: -20,
        filter: 'blur(8px)',
        transition: { duration: 0.4, ease: 'easeInOut' },
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Glass Card */}
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-black/40"
        whileHover={
          shouldAnimate && !isProcessing
            ? {
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)',
              }
            : {}
        }
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-linear-to-br from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20 blur-3xl" />

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <motion.div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-500 shadow-lg"
              animate={
                shouldAnimate
                  ? {
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </motion.div>
            <h2 className="font-heading text-on-surface text-xl font-bold md:text-2xl">Enter Two Names</h2>
            <p className="text-on-surface-variant mt-1 text-sm">Find out what destiny has in store</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Name 1 */}
            <div className="group">
              <label htmlFor="name1" className="text-on-surface mb-2 block text-sm font-semibold">
                First Name
              </label>
              <div className="relative">
                <input
                  id="name1"
                  type="text"
                  value={name1}
                  onChange={handleName1Change}
                  onFocus={() => {
                    sound.playSound('pop');
                    setFocusedField('name1');
                  }}
                  onBlur={() => handleBlur('name1')}
                  aria-describedby={errors.name1?.length ? 'name1-error' : undefined}
                  aria-invalid={errors.name1?.length ? 'true' : undefined}
                  className={`w-full rounded-xl border-2 bg-white/50 px-4 py-3.5 text-base font-medium transition-all duration-200 placeholder:text-gray-400 focus:outline-none dark:bg-white/5 ${
                    errors.name1?.length
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                      : focusedField === 'name1'
                        ? 'border-primary focus:ring-primary/20 focus:ring-4'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder="Your name..."
                  required
                  disabled={isProcessing}
                  autoComplete="off"
                  suppressHydrationWarning
                />
                {/* Focus glow effect */}
                {focusedField === 'name1' && shouldAnimate && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl bg-linear-to-r from-pink-500/20 to-purple-500/20 blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </div>
              {errors.name1?.[0] && (
                <motion.p
                  id="name1-error"
                  role="alert"
                  className="mt-1.5 text-sm text-red-500"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name1[0]}
                </motion.p>
              )}
            </div>

            {/* Heart divider */}
            <div className="flex items-center justify-center py-1">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
              <motion.span
                className="mx-4 text-2xl"
                animate={shouldAnimate && name1 && name2 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💕
              </motion.span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
            </div>

            {/* Name 2 */}
            <div className="group">
              <label htmlFor="name2" className="text-on-surface mb-2 block text-sm font-semibold">
                Second Name
              </label>
              <div className="relative">
                <input
                  id="name2"
                  type="text"
                  value={name2}
                  onChange={handleName2Change}
                  onFocus={() => {
                    sound.playSound('pop');
                    setFocusedField('name2');
                  }}
                  onBlur={() => handleBlur('name2')}
                  aria-describedby={errors.name2?.length ? 'name2-error' : undefined}
                  aria-invalid={errors.name2?.length ? 'true' : undefined}
                  className={`w-full rounded-xl border-2 bg-white/50 px-4 py-3.5 text-base font-medium transition-all duration-200 placeholder:text-gray-400 focus:outline-none dark:bg-white/5 ${
                    errors.name2?.length
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                      : focusedField === 'name2'
                        ? 'border-primary focus:ring-primary/20 focus:ring-4'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder="Their name..."
                  required
                  disabled={isProcessing}
                  autoComplete="off"
                  suppressHydrationWarning
                />
                {focusedField === 'name2' && shouldAnimate && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </div>
              {errors.name2?.[0] && (
                <motion.p
                  id="name2-error"
                  role="alert"
                  className="mt-1.5 text-sm text-red-500"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name2[0]}
                </motion.p>
              )}
            </div>

            {/* General Errors */}
            {errors.general?.[0] && (
              <motion.div
                role="alert"
                aria-live="polite"
                className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.general[0]}
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-pink-500 via-rose-500 to-red-500 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
            whileHover={
              shouldAnimate && isFormValid && !isProcessing
                ? {
                    scale: 1.02,
                    boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.5)',
                  }
                : {}
            }
            whileTap={shouldAnimate && isFormValid && !isProcessing ? { scale: 0.98 } : {}}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent"
              animate={
                shouldAnimate && isFormValid && !isProcessing
                  ? {
                      translateX: ['-100%', '100%'],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            />

            <span className="relative flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Finding destiny...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🔥</span>
                  <span>Reveal Your FLAMES</span>
                  <span className="text-lg">🔥</span>
                </>
              )}
            </span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export const InputForm = memo(InputFormComponent);

export default InputForm;