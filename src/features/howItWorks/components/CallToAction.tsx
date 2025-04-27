import Button from '@components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Call To Action component at the bottom of the How It Works page
 */
export default function CallToAction() {
  return (
    <motion.div
      className="py-12 text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h2 className="font-heading mb-6 text-3xl font-bold text-gray-800 md:text-4xl dark:text-white">
        🔥 Ready to Find Your Own Spark?
      </h2>
      <div className="flex justify-center">
        <Link to="/">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            Play The Flames Now!
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
