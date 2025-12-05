import LoadingScreen from '@components/ui/LoadingScreen';
import { Suspense } from 'react';
import ManualMode from '../features/flamesGame/ManualMode';
import ErrorBoundary from '../features/flamesGame/ManualMode/components/ErrorBoundary';

export default function ManualModePage() {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <Suspense
          fallback={<LoadingScreen message="Loading Manual Mode..." fullScreen={false} className="min-h-screen" />}
        >
          <ManualMode />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
