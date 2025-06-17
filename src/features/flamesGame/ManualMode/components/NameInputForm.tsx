import { motion } from 'framer-motion';
import { ArrowRight, Heart, Info, Pen, Pointer } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';
import type { NameInputFormProps } from '../types';
import { validateNameInput } from '../utils';

// Animation variants for a cleaner and more declarative structure
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function NameInputForm({ onNamesSubmit, initialName1 = '', initialName2 = '' }: NameInputFormProps) {
  const [name1, setName1] = useState(initialName1);
  const [name2, setName2] = useState(initialName2);
  const [isLoading, setIsLoading] = useState(false);

  const performSubmit = (experienceMode: 'click' | 'canvas') => {
    if (isLoading) return;

    const error1 = validateNameInput(name1);
    if (error1) {
      toast.error(`Name 1: ${error1}`);
      return;
    }

    const error2 = validateNameInput(name2);
    if (error2) {
      toast.error(`Name 2: ${error2}`);
      return;
    }

    if (name1.toLowerCase() === name2.toLowerCase()) {
      toast.error('Names cannot be the same');
      return;
    }

    setIsLoading(true);
    // Small delay for better UX
    setTimeout(() => {
      onNamesSubmit(name1.trim(), name2.trim(), experienceMode);
      setIsLoading(false);
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Default to 'click' experience on Enter key press
      performSubmit('click');
    }
  };

  const isFormValid = name1.trim().length >= 2 && name2.trim().length >= 2;

  return (
    <main className="bg-background flex min-h-[100svh] items-center justify-center overflow-y-auto p-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <div className="bg-surface/80 border-outline/20 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <Heart className="text-primary mx-auto mb-4 h-12 w-12" />
            <h1 className="text-on-surface mb-2 text-3xl font-bold tracking-tight">FLAMES Manual Mode</h1>
            <p className="text-on-surface-variant">Discover your relationship destiny.</p>
          </motion.div>

          {/* Form */}
          <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleFormSubmit}>
            {/* Name Inputs */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name1" className="text-on-surface mb-2 block text-sm font-medium">
                  First Name
                </label>
                <input
                  id="name1"
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Enter first name..."
                  className="bg-surface-container border-outline/30 text-on-surface placeholder-on-surface-variant focus:ring-primary/50 focus:border-primary hover:border-primary/50 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                  maxLength={20}
                />
              </div>

              <div>
                <label htmlFor="name2" className="text-on-surface mb-2 block text-sm font-medium">
                  Second Name
                </label>
                <input
                  id="name2"
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Enter second name..."
                  className="bg-surface-container border-outline/30 text-on-surface placeholder-on-surface-variant focus:ring-primary/50 focus:border-primary hover:border-primary/50 w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:ring-2 focus:outline-none"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Experience Mode Selection */}
            <motion.div variants={itemVariants} className="space-y-6 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="border-outline/20 w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface/80 text-on-surface-variant px-3 text-base font-medium">
                    Choose Your Experience
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Click Experience */}
                <Button
                  type="button"
                  onClick={() => performSubmit('click')}
                  disabled={!isFormValid || isLoading}
                  className="group bg-primary-container text-on-primary-container hover:bg-primary-container/80 flex w-full items-center justify-between space-x-3 rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                  variant="outline"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <Pointer className="h-5 w-5" />
                      <span className="font-semibold">Interactive</span>
                    </div>
                    <p className="text-on-primary-container/80 mt-1 text-sm">Step-by-step reveal</p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>

                {/* Canvas Experience */}
                <Button
                  type="button"
                  onClick={() => performSubmit('canvas')}
                  disabled={!isFormValid || isLoading}
                  className="group bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 flex w-full items-center justify-between space-x-3 rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                  variant="outline"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <Pen className="h-5 w-5" />
                      <span className="font-semibold">Creative</span>
                    </div>
                    <p className="text-on-secondary-container/80 mt-1 text-sm">Scratch to reveal</p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              variants={itemVariants}
              className="bg-tertiary-container/20 border-tertiary-container/30 flex items-center space-x-3 rounded-xl border p-3"
            >
              <Info className="text-tertiary-container h-5 w-5 flex-shrink-0" />
              <p className="text-on-surface-variant text-sm">
                Names must be 2-20 characters long and contain only letters.
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </main>
  );
}
