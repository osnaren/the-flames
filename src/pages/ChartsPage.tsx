import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame } from 'lucide-react';
import Button from '../components/ui/Button';
import GlobalCharts from '../components/layout/GlobalCharts/GlobalCharts';

export default function ChartsPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 md:p-6"
      >
        <div className="flex items-center mb-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={goBack}
            icon={ArrowLeft}
          >
            Back
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          <motion.div 
            className="flex justify-center mb-2"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatType: 'reverse'
            }}
          >
            <Flame className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">
            FLAMES Global Charts
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-1">
            Discover relationship trends around the world
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <GlobalCharts isStandalone={true} />
        </div>
      </motion.div>
    </div>
  );
}