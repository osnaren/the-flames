import Button from '@components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Header component for How It Works page
 * Includes navigation back button and page title
 */
export default function Header() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <>
      {/* Back Button */}
      <motion.div
        className="mb-4 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button variant="secondary" size="sm" onClick={goBack} icon={ArrowLeft}>
          Back to Game
        </Button>
      </motion.div>

      {/* Title Section */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="mb-4 flex justify-center"
          animate={{
            scale: [1, 1.15, 1],
            filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <Flame className="text-primary-container h-16 w-16 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
        </motion.div>
        <h1 className="font-heading text-on-background mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          How Does <span className="text-primary-container">FLAMES</span> Ignite?
        </h1>
        <p className="text-on-surface-variant text-lg">
          Discover the sparks behind the classic childhood game, one step at a time.
        </p>
      </motion.div>
    </>
  );
}
