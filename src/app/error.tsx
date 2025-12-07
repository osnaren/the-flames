'use client';

import Button from '@/components/ui/Button/Button';
import * as Sentry from '@sentry/nextjs';
import { motion } from 'framer-motion';
import { Flame, Home, RefreshCcw, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
      {/* Animated background glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="z-10 flex max-w-2xl flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Fire emoji with glow effect */}
        <motion.div
          variants={itemVariants}
          className="relative mb-6"
        >
          <motion.div
            className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 shadow-2xl"
            animate={{
              boxShadow: [
                '0 0 30px rgba(239, 68, 68, 0.3)',
                '0 0 50px rgba(239, 68, 68, 0.5)',
                '0 0 30px rgba(239, 68, 68, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="h-14 w-14 text-red-500" strokeWidth={1.5} />
          </motion.div>
          <motion.div
            className="absolute -right-1 -top-1"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Zap className="h-8 w-8 text-yellow-500" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-on-surface text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          Oops! <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Too Hot to Handle</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-on-surface-variant mt-4 max-w-md text-base sm:text-lg"
        >
          Something sparked an error. 🔥 Our love calculator overheated, but we're cooling things down!
        </motion.p>

        {/* Dev error details */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            variants={itemVariants}
            className="bg-error-container/50 text-on-error-container mt-6 max-w-lg rounded-xl border border-red-500/20 p-4 text-left backdrop-blur-sm"
          >
            <p className="font-mono text-sm font-bold">🐛 {error.message}</p>
            {error.digest && <p className="mt-1 font-mono text-xs opacity-70">Digest: {error.digest}</p>}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button onClick={() => reset()} variant="primary" size="lg" icon={RefreshCcw}>
            Rekindle
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" icon={Home}>
              Back to Safety
            </Button>
          </Link>
        </motion.div>

        {/* Reassuring footer */}
        <motion.p
          variants={itemVariants}
          className="text-on-surface-variant/50 mt-10 text-sm"
        >
          Don't worry, your love life is still intact. This is just a technical hiccup! 💕
        </motion.p>
      </motion.div>
    </div>
  );
}
