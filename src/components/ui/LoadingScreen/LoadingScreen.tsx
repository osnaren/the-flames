'use client';

import Logo from '@components/ui/Logo';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingScreen({
  message = 'Loading...',
  fullScreen = true,
  className = '',
}: LoadingScreenProps) {
  return (
    <div
      className={`bg-surface/80 flex flex-col items-center justify-center backdrop-blur-md ${fullScreen ? 'fixed inset-0 z-50' : 'h-full min-h-[200px] w-full'} ${className} `}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          {/* Pulse effect behind the logo */}
          <motion.div
            className="bg-primary/20 absolute inset-0 rounded-full blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative scale-150 transform">
            <Logo variant="animated" animationType="continuous" showText={false} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-on-surface text-lg font-medium tracking-wider">{message}</p>

          {/* Loading dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-primary h-1.5 w-1.5 rounded-full"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
