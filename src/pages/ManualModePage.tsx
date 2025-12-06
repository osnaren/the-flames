import LoadingScreen from '@components/ui/LoadingScreen';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import ErrorBoundary from '../features/flamesGame/ManualMode/components/ErrorBoundary';

// Lazy load ManualMode as it's a heavy component with canvas
const ManualMode = dynamic(() => import('../features/flamesGame/ManualMode'), {
  ssr: false,
  loading: () => <LoadingScreen message="Loading Manual Mode..." fullScreen={false} className="min-h-screen" />,
});

function ManualModePage() {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <ManualMode />
      </ErrorBoundary>
    </div>
  );
}

export default memo(ManualModePage);
