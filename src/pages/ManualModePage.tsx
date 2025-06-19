import { Suspense } from 'react';
import toast from 'react-hot-toast';
import ManualMode from '../features/flamesGame/ManualMode';
import ErrorBoundary from '../features/flamesGame/ManualMode/components/ErrorBoundary';
import { FlamesResult } from '../features/flamesGame/flames.types';
import { shareResult } from '../lib/share';

export default function ManualModePage() {
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
          <ManualMode />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
