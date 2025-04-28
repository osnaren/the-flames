import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { scrollYProgress } = useScroll();
  const footerOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  return (
    <motion.footer
      style={{ opacity: footerOpacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="from-surface-container-lowest/50 border-outline/10 mt-auto border-t bg-gradient-to-t to-transparent px-4 py-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          {/* Copyright */}
          <div className="text-on-surface-variant text-sm">© 2025 OSLabs. All rights reserved.</div>

          {/* Navigation */}
          <nav
            className="text-on-surface-variant flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm"
            aria-label="Footer Navigation"
          >
            <Link
              to="/how-it-works"
              className="hover:text-primary hover:text-glow-sm after:bg-primary relative transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:transition-all hover:after:w-full"
            >
              How It Works
            </Link>
            <Link
              to="/manual"
              className="hover:text-primary hover:text-glow-sm after:bg-primary relative transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:transition-all hover:after:w-full"
            >
              Manual Mode
            </Link>
            <a
              href="https://github.com/osnaren/the-flames/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:text-glow-sm after:bg-primary relative transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:transition-all hover:after:w-full"
              aria-label="Feedback on GitHub (opens in new tab)"
            >
              Feedback
            </a>
          </nav>

          {/* Creator Credit */}
          <div className="text-on-surface-variant flex items-center text-sm">
            <span>Cooked up with</span>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              className="mx-1.5"
            >
              <Heart className="text-error text-glow-sm h-4 w-4" />
            </motion.div>
            <span>at OSLabs 🇮🇳</span>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          className="text-outline mt-8 text-center text-xs italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
        >
          For entertainment only. No guarantees on marriage 💍
        </motion.div>
      </div>
    </motion.footer>
  );
}
