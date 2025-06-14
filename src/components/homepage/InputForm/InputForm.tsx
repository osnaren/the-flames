import { GameStage } from '@features/flamesGame/flames.types';
import { AnimatePresence, motion } from 'framer-motion';
import { VenetianMask } from 'lucide-react';
import { useCallback, useState } from 'react';

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
}: InputFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;

      setIsSubmitting(true);

      if (shouldAnimate) {
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
        }));
        setParticles(newParticles);

        setTimeout(() => setParticles([]), 1000);
      }

      onSubmit(e);
    },
    [onSubmit, isSubmitting, shouldAnimate]
  );

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

      <motion.div
        className="bg-surface/90 border-outline/20 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl"
        animate={{
          boxShadow: isSubmitting && shouldAnimate ? submittingBoxShadowKeyframes : initialBoxShadow,
        }}
        transition={{
          duration: isButtonHovered ? 1.5 : isSubmitting ? 0.5 : 0.3,
          repeat: isButtonHovered || (isSubmitting && shouldAnimate) ? Infinity : isSubmitting ? 2 : 0,
          repeatType: isButtonHovered ? 'mirror' : 'loop',
          ease: 'easeInOut',
        }}
      >
        {/* <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} /> */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="mb-8 text-center"
            animate={isSubmitting && shouldAnimate ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-on-surface mb-2 text-2xl font-bold">Enter Two Names</h2>
            <p className="text-on-surface-variant">Discover your relationship destiny</p>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              animate={
                isSubmitting && shouldAnimate
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
                onChange={(e) => setName1(e.target.value)}
                className="bg-surface-container border-outline/30 text-on-surface placeholder-on-surface-variant/60 focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                placeholder="Who are you? 💁"
                required
                disabled={isSubmitting}
                autoComplete="given-name"
              />
            </motion.div>

            <motion.div
              animate={
                isSubmitting && shouldAnimate
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
                onChange={(e) => setName2(e.target.value)}
                className="bg-surface-container border-outline/30 text-on-surface placeholder-on-surface-variant/60 focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                placeholder="Their name? 💘"
                required
                disabled={isSubmitting}
                autoComplete="family-name"
              />
            </motion.div>
          </div>

          <motion.div
            className="bg-surface-container/50 border-outline/20 flex items-center justify-between rounded-xl border p-4"
            animate={
              isSubmitting && shouldAnimate
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
              disabled={isSubmitting}
              whileTap={shouldAnimate ? { scale: 0.95 } : {}}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                animate={{ x: anonymous ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!name1.trim() || !name2.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90 disabled:bg-outline/20 disabled:text-on-surface-variant text-on-primary focus:ring-primary/50 w-full cursor-pointer rounded-xl px-6 py-4 font-semibold shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:shadow-none"
            whileHover={shouldAnimate && !isSubmitting ? { scale: 1.02, y: -2 } : {}}
            whileTap={shouldAnimate && !isSubmitting ? { scale: 0.98 } : {}}
            onHoverStart={() => {
              if (shouldAnimate && !isSubmitting) setIsButtonHovered(true);
            }}
            onHoverEnd={() => setIsButtonHovered(false)}
            animate={
              isSubmitting && shouldAnimate
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
            transition={{ duration: 0.3, repeat: isSubmitting ? 3 : 0 }}
          >
            {isSubmitting ? (
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
