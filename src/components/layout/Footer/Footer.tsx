import { motion } from 'framer-motion';
import { Flame, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="from-surface-container-lowest/50 mt-auto bg-gradient-to-t to-transparent px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          {/* Brand */}
          <div className="flex items-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Flame className="text-primary text-glow-sm h-6 w-6" />
            </motion.div>
            <span className="from-primary via-primary-container to-error ml-2 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
              The Flames
            </span>
          </div>

          {/* Navigation */}
          <nav className="text-on-surface-variant flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/how-it-works" className="hover:text-primary hover:text-glow-sm transition-colors">
              How It Works
            </Link>
            <Link to="/manual" className="hover:text-primary hover:text-glow-sm transition-colors">
              Manual Mode
            </Link>
            <a
              href="https://github.com/yourusername/flames/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:text-glow-sm transition-colors"
            >
              Feedback
            </a>
          </nav>

          {/* Creator Credit */}
          <div className="text-on-surface-variant flex items-center text-sm">
            <span>Built with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="mx-1"
            >
              <Heart className="text-error text-glow-sm h-4 w-4" />
            </motion.div>
            <span>by Naren</span>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          className="text-outline mt-6 text-center text-xs italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          For entertainment only. No guarantees on marriage 💍
        </motion.div>
      </div>
    </footer>
  );
}
