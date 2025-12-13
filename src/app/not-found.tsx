'use client';

import { SparklesText } from '@/components/magicui/sparkles-text';
import Button from '@/components/ui/Button/Button';
import { motion } from 'framer-motion';
import { HeartCrack, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Animated broken heart component
function BrokenHeart() {
  return (
    <motion.div
      className="relative mb-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.div
        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-pink-500/20 to-red-500/20 shadow-2xl shadow-pink-500/20"
        animate={{
          boxShadow: [
            '0 0 20px rgba(236, 72, 153, 0.3)',
            '0 0 40px rgba(236, 72, 153, 0.5)',
            '0 0 20px rgba(236, 72, 153, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <HeartCrack className="h-16 w-16 text-pink-500" strokeWidth={1.5} />
      </motion.div>
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-pink-400"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
            y: [0, -50 - i * 10],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </motion.div>
  );
}

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-pink-500/5 via-transparent to-purple-500/5" />

      <motion.div
        className="z-10 flex max-w-2xl flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Broken Heart Animation */}
        <BrokenHeart />

        {/* Animated 404 Headline */}
        <motion.div variants={itemVariants}>
          <SparklesText
            className="text-7xl font-black tracking-tighter text-gray-900 sm:text-8xl md:text-9xl dark:text-white"
            colors={{ first: '#F97316', second: '#EC4899' }}
            sparklesCount={12}
          >
            404
          </SparklesText>
        </motion.div>

        {/* Witty Copy */}
        <motion.div variants={itemVariants} className="mt-6 space-y-3">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl dark:text-gray-100">
            Looks like you've been{' '}
            <span className="bg-linear-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">ghosted</span>
          </h1>
          <p className="mx-auto max-w-md text-base text-gray-600 sm:text-lg dark:text-gray-300">
            This page swiped left on you. 💔 But don't worry, your perfect match is just a click away!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link href="/">
            <Button variant="primary" size="lg" icon={Home}>
              Find Your Match
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="outline" size="lg" icon={Sparkles}>
              How FLAMES Works
            </Button>
          </Link>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-3 gap-4 rounded-2xl border border-gray-200/50 bg-white/50 p-4 backdrop-blur-sm sm:gap-8 sm:p-6 dark:border-gray-700/50 dark:bg-gray-800/50"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-500 sm:text-3xl">0%</div>
            <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">Compatibility</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500 sm:text-3xl">404</div>
            <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">Page Not Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 sm:text-3xl">∞</div>
            <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">Other Options</div>
          </div>
        </motion.div>

        {/* Playful Footer */}
        <motion.p variants={itemVariants} className="mt-8 text-sm text-gray-400 dark:text-gray-500">
          Error Code: <span className="font-mono">LOVE_NOT_FOUND</span> 💘
        </motion.p>
      </motion.div>
    </div>
  );
}
