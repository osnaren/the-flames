'use client';

import { motion } from 'framer-motion';

interface FlamesLetterBadgeProps {
  letter: string;
  meaning: string;
  color: string;
}

export function FlamesLetterBadge({ letter, meaning, color }: FlamesLetterBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
      className={`inline-flex items-center gap-2 rounded-full bg-linear-to-r ${color} px-4 py-2 text-white shadow-lg`}
    >
      <span className="text-lg font-bold">{letter}</span>
      <span className="text-sm opacity-90">= {meaning}</span>
    </motion.div>
  );
}
