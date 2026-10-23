'use client';

import { memo } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ManualMode from './ManualMode';

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
