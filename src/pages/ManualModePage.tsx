import { Suspense } from 'react';
import ManualMode from '../features/flamesGame/ManualMode';
import ErrorBoundary from '../features/flamesGame/ManualMode/components/ErrorBoundary';

export default function ManualModePage() {
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
