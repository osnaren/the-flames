import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ManualMode from '../features/flamesGame/ManualMode';
import ErrorBoundary from '../features/flamesGame/ManualMode/components/ErrorBoundary';
import { FlamesResult } from '../features/flamesGame/flames.types';
import { shareResult } from '../lib/share';

export default function ManualModePage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  const handleShare = async (result: FlamesResult) => {
    try {
      await shareResult({
        name1: 'Your Name',
        name2: 'Their Name',
        result,
        resultText: 'Manual Mode Result',
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share result');
    }
  };

  return (
    <div className="min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 left-4 z-50">
        <Button variant="secondary" size="sm" onClick={goBack} icon={ArrowLeft}>
          Back
        </Button>
      </motion.div>

      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading Manual Mode...</p>
              </div>
            </div>
          }
        >
          <ManualMode onShare={handleShare} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
