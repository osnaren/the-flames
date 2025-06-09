import { motion } from 'framer-motion';
import { ArrowLeft, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlobalCharts from '../components/layout/GlobalCharts/GlobalCharts';
import Button from '../components/ui/Button';

export default function ChartsPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6">
        <div className="mb-4 flex items-center">
          <Button variant="secondary" size="sm" onClick={goBack} icon={ArrowLeft}>
            Back
          </Button>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center">
          <motion.div
            className="mb-2 flex justify-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: 'reverse',
            }}
          >
            <Flame className="h-8 w-8 text-orange-500 dark:text-orange-400" />
          </motion.div>
          <h1 className="text-center text-2xl font-bold text-gray-800 md:text-3xl dark:text-white">
            FLAMES Global Charts
          </h1>
          <p className="mt-1 text-center text-gray-600 dark:text-gray-300">
            Discover relationship trends around the world
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <GlobalCharts isStandalone={true} />
        </div>
      </motion.div>
    </div>
  );
}
