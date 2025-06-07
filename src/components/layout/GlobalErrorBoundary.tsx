import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Button from '../ui/Button';

type Props = { children: React.ReactNode };

function Fallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Something went wrong</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{error.message}</p>
        <Button variant="primary" onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default function GlobalErrorBoundary({ children }: Props) {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
}
