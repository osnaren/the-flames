import { AnimatedGroup } from '@components/shadcn/animated-group';

import { ApiHero, ApiOverview, ErrorCodes, InteractiveExample, RateLimits } from './components';

export function ApiDocsPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="relative container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <ApiHero />

        <AnimatedGroup preset="blur-slide" className="mt-16 space-y-12">
          <ApiOverview />
          <InteractiveExample />
          <RateLimits />
          <ErrorCodes />
        </AnimatedGroup>
      </div>
    </div>
  );
}
