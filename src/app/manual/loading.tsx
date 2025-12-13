import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-on-surface-variant animate-pulse text-sm font-medium">Loading manual mode...</p>
      </div>
    </div>
  );
}
