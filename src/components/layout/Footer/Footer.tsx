import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {/* Brand */}
          <div className="flex items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            </motion.div>
            <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400">
              The Flames
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link 
              to="/how-it-works" 
              className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/manual" 
              className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              Manual Mode
            </Link>
            <a 
              href="https://github.com/yourusername/flames/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              Feedback
            </a>
          </nav>

          {/* Creator Credit */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Built with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mx-1"
            >
              <Heart className="w-4 h-4 text-red-500" />
            </motion.div>
            <span>by Naren</span>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div 
          className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500 italic"
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