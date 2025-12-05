'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to privacy page which contains both privacy and terms
    router.replace('/privacy#terms');
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-muted-foreground animate-pulse text-lg">Redirecting to Privacy & Terms...</div>
    </div>
  );
}
