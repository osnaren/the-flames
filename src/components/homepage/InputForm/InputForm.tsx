import { validateFlamesInput, validateName } from '@/utils/validation';
import { GameStage } from '@features/flamesGame/flames.types';
import { AnimatePresence, motion } from 'framer-motion';
import { VenetianMask } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface InputFormProps {
  name1: string;
  name2: string;
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  shouldAnimate: boolean;
  anonymous: boolean;
  setAnonymous: (value: boolean) => void;
  stage: GameStage;
  isCollapsing?: boolean;
  isProcessing?: boolean; // Single source of truth for form processing state
}

interface FormErrors {
  name1?: string[];
  name2?: string[];
  general?: string[];
}

export function InputForm({
  name1,
  name2,
  setName1,
  setName2,
  onSubmit,
  shouldAnimate,
  anonymous,
  setAnonymous,
  isCollapsing = false,
  isProcessing = false,
}: InputFormProps) {
  // Component state
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-clear errors when processing completes
  useEffect(() => {
    if (!isProcessing) {
      setErrors({});
    }
  }, [isProcessing]);

  // Individual field validation
  const validateField = useCallback((fieldName: 'name1' | 'name2', value: string) => {
    // Skip validation for empty fields unless it's a form submission
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

  // Cross-field validation (e.g., names being the same)
  const validateCrossFields = useCallback(() => {
    // Only validate if both fields have values
    if (!name1.trim() || !name2.trim()) {
      // Clear general errors if either field is empty
      setErrors((prev) => ({ ...prev, general: undefined }));
      return;
    }

    const result = validateFlamesInput(name1, name2);

    if (result.errors.general && result.errors.general.length > 0) {
      setErrors((prev) => ({ ...prev, general: result.errors.general }));
    } else {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  }, [name1, name2]);

  // Input change handlers
  const handleName1Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setName1(value);

      // Clear errors when user starts typing
      setErrors((prev) => ({
        ...prev,
        name1: undefined,
        general: undefined,
      }));
    },
    [setName1]
  );

  const handleName2Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setName2(value);

      // Clear errors when user starts typing
      setErrors((prev) => ({
        ...prev,
        name2: undefined,
        general: undefined,
      }));
    },
    [setName2]
  );

  // Blur validation handlers
  const handleName1Blur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;

      try {
        // Validate this field
        validateField('name1', value);

        // Run cross-validation if both fields have values
        if (value.trim() && name2.trim()) {
          setTimeout(() => validateCrossFields(), 100);
        }
      } catch (error) {
        console.error('Error during name1 blur validation:', error);
      }
    },
    [validateField, validateCrossFields, name2]
  );

  const handleName2Blur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;

      try {
        // Validate this field
        validateField('name2', value);

        // Run cross-validation if both fields have values
        if (value.trim() && name1.trim()) {
          setTimeout(() => validateCrossFields(), 100);
        }
      } catch (error) {
        console.error('Error during name2 blur validation:', error);
      }
    },
    [validateField, validateCrossFields, name1]
  );

  // Form validation state
  const isFormValid = useMemo(() => {
    const hasErrors = Boolean(errors.name1?.length || errors.name2?.length || errors.general?.length);
    return name1.trim() && name2.trim() && !hasErrors;
  }, [name1, name2, errors]);

  // Form submission handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent submission if already processing
      if (isProcessing) return;

      // Perform complete validation before submission
      const name1Result = validateName(name1);
      const name2Result = validateName(name2);
      const combinedResult = validateFlamesInput(name1, name2);

      // Collect all validation errors
      const validationErrors: FormErrors = {
        name1: name1Result.isValid ? undefined : name1Result.errors,
        name2: name2Result.isValid ? undefined : name2Result.errors,
        general: combinedResult.errors.general,
      };

      setErrors(validationErrors);

      // Only proceed if all validation passes
      const isValid = name1Result.isValid && name2Result.isValid && combinedResult.isValid;

      if (isValid) {
        // Create particle effect for successful submission
        if (shouldAnimate) {
          const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
          }));
          setParticles(newParticles);
          setTimeout(() => setParticles([]), 1000);
        }

        // Submit the form
        onSubmit(e);
      }
    },
    [onSubmit, isProcessing, shouldAnimate, name1, name2]
  );

  // Animation constants
  const initialBoxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
  const submittingBoxShadowKeyframes = [
    initialBoxShadow,
    '0 0 50px rgba(var(--color-primary-rgb), 0.3)',
    initialBoxShadow,
  ];

  return (
    <motion.div
      key="input-form-content"
      className="relative"
      initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
      transition={{
        duration: shouldAnimate ? 0.8 : 0,
        ease: 'easeInOut',
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="bg-primary pointer-events-none absolute h-2 w-2 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: '0 0 8px rgba(var(--color-primary-rgb), 0.8)',
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Form Container */}
      <motion.div
        className="bg-surface/90 border-outline/20 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl"
        animate={{
          boxShadow: isProcessing ? submittingBoxShadowKeyframes : initialBoxShadow,
        }}
        transition={{
          duration: isButtonHovered ? 1.5 : isProcessing ? 0.5 : 0.3,
          repeat: isButtonHovered || isProcessing ? Infinity : isProcessing ? 2 : 0,
          repeatType: isButtonHovered ? 'mirror' : 'loop',
          ease: 'easeInOut',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Header */}
          <motion.div
            className="mb-8 text-center"
            animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-on-surface mb-2 text-2xl font-bold">Enter Two Names</h2>
            <p className="text-on-surface-variant">Discover your relationship destiny</p>
          </motion.div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Name 1 Input */}
            <motion.div
              animate={
                isProcessing
                  ? {
                      x: [-2, 2, -2, 2, 0],
                      scale: [1, 0.98, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.4 }}
            >
              <label htmlFor="name1" className="text-on-surface mb-2 block text-sm font-medium">
                First Name
              </label>
              <input
                id="name1"
                type="text"
                value={name1}
                onChange={handleName1Change}
                onBlur={handleName1Blur}
                className={`bg-surface-container border-outline/30 text-on-surface placeholder-on-surface-variant/60 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:outline-none ${
                  errors.name1?.length
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'focus:border-primary focus:ring-primary/20'
                } ${errors.name1?.length ? 'ring-error/20 ring-2' : 'focus:ring-2'}`}
                placeholder="Who are you? 💁"
                required
                disabled={isProcessing}
                autoComplete="given-name"
              />
              {errors.name1 && errors.name1.length > 0 && (
                <motion.div
                  className="text-error mt-1 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.name1[0]}
                </motion.div>
              )}
            </motion.div>

            {/* Name 2 Input */}
            <motion.div
              animate={
                isProcessing
                  ? {
                      x: [2, -2, 2, -2, 0],
                      scale: [1, 0.98, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label htmlFor="name2" className="text-on-surface mb-2 block text-sm font-medium">
                Second Name
              </label>
              <input
                id="name2"
                type="text"
                value={name2}
                onChange={handleName2Change}
                onBlur={handleName2Blur}
                className={`bg-surface-container border-outline/30 text-on-surface placeholder-on-surface-variant/60 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:outline-none ${
                  errors.name2?.length
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'focus:border-primary focus:ring-primary/20'
                } ${errors.name2?.length ? 'ring-error/20 ring-2' : 'focus:ring-2'}`}
                placeholder="Their name? 💘"
                required
                disabled={isProcessing}
                autoComplete="family-name"
              />
              {errors.name2 && errors.name2.length > 0 && (
                <motion.div
                  className="text-error mt-1 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.name2[0]}
                </motion.div>
              )}
            </motion.div>

            {/* General Errors (e.g., same names) */}
            {errors.general && errors.general.length > 0 && (
              <motion.div
                className="text-error bg-error/10 rounded-lg p-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.general[0]}
              </motion.div>
            )}
          </div>

          {/* Anonymous Mode Toggle */}
          <motion.div
            className="bg-surface-container/50 border-outline/20 flex items-center justify-between rounded-xl border p-4"
            animate={
              isProcessing
                ? {
                    opacity: [1, 0.7, 1],
                    scale: [1, 0.95, 1],
                  }
                : {}
            }
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div>
              <label htmlFor="anonymous" className="text-on-surface flex items-center gap-1 text-sm font-medium">
                Anonymous Mode
                <VenetianMask className="h-4 w-4" />
              </label>
              <p className="text-on-surface-variant mt-1 text-xs">
                Keep your names private while still contributing to our statistics
              </p>
            </div>
            <motion.button
              type="button"
              id="anonymous"
              onClick={() => setAnonymous(!anonymous)}
              className={`focus:ring-primary relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                anonymous ? 'bg-primary' : 'bg-surface-variant border-outline'
              }`}
              disabled={isProcessing}
              whileTap={shouldAnimate ? { scale: 0.95 } : {}}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                animate={{ x: anonymous ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className="bg-primary hover:bg-primary/90 disabled:bg-outline/20 disabled:text-on-surface-variant text-on-primary ring-primary/50 w-full cursor-pointer rounded-xl px-6 py-4 font-semibold shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:shadow-none"
            whileHover={shouldAnimate && !isProcessing && isFormValid ? { scale: 1.02, y: -2 } : {}}
            whileTap={shouldAnimate && !isProcessing && isFormValid ? { scale: 0.98 } : {}}
            onHoverStart={() => {
              if (shouldAnimate && !isProcessing && isFormValid) setIsButtonHovered(true);
            }}
            onHoverEnd={() => setIsButtonHovered(false)}
            animate={
              isProcessing
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                      '0 0 30px rgba(var(--color-primary-rgb), 0.4)',
                      '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.3, repeat: isProcessing ? 3 : 0 }}
          >
            {isProcessing ? (
              <motion.div
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="border-on-primary/30 border-t-on-primary h-5 w-5 rounded-full border-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span>Calculating...</span>
              </motion.div>
            ) : (
              <span>Calculate FLAMES 🔥</span>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Collapse Animation Effect */}
      {isCollapsing && shouldAnimate && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-primary/60 absolute h-1 w-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0,
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
              }}
              transition={{
                duration: 0.8,
                delay: Math.random() * 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default InputForm;
