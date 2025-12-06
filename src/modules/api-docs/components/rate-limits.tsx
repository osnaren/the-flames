import { Badge } from '@components/shadcn/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/shadcn/card';
import { Progress } from '@components/shadcn/progress';
import { apiDocsConfig } from '../config';

export function RateLimits() {
  const sampleUsage = 10; // representative safe usage for visualization
  const percentUsed = Math.min(100, (sampleUsage / apiDocsConfig.rateLimits.limits.requests) * 100);

  return (
    <Card className="border-border bg-surface-container-low shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">{apiDocsConfig.rateLimits.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{apiDocsConfig.rateLimits.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-semibold">API Limits</h4>
            <div className="border-border bg-surface-container space-y-3 rounded-2xl border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Requests / window</span>
                <Badge variant="secondary">{apiDocsConfig.rateLimits.limits.requests}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time window</span>
                <Badge variant="secondary">{apiDocsConfig.rateLimits.limits.window}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Max name length</span>
                <Badge variant="secondary">{apiDocsConfig.rateLimits.limits.maxNameLength}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Algorithm</span>
                <Badge variant="outline">{apiDocsConfig.rateLimits.limits.algorithm}</Badge>
              </div>
              <div>
                <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                  <span>Illustrative usage</span>
                  <span>
                    {sampleUsage}/{apiDocsConfig.rateLimits.limits.requests} requests
                  </span>
                </div>
                <Progress value={percentUsed} aria-label="Sample usage of rate limit" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-semibold">Response headers</h4>
            <div className="space-y-3">
              {apiDocsConfig.rateLimits.headers.map((header) => (
                <div key={header.name} className="bg-surface-container border-border rounded-2xl border p-4">
                  <p className="text-primary font-mono text-sm">{header.name}</p>
                  <p className="text-muted-foreground text-xs">{header.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {apiDocsConfig.rateLimits.timeline.map((phase) => (
            <div
              key={phase.label}
              className="bg-surface-container hover:bg-surface-container-high hover:border-primary/30 border-border rounded-2xl border p-4 transition-all duration-300"
            >
              <p className="text-muted-foreground text-xs tracking-wide uppercase">{phase.label}</p>
              <p className="text-foreground text-lg font-semibold">{phase.status}</p>
              <p className="text-muted-foreground text-sm">{phase.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h5 className="font-semibold text-amber-800 dark:text-amber-200">Rate limit best practices</h5>
              <p className="text-xs text-amber-700 dark:text-amber-300/80">
                {apiDocsConfig.rateLimits.cooldownHint}
              </p>
            </div>
            <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
              {apiDocsConfig.rateLimits.bestPractices.map((practice) => (
                <li key={practice}>• {practice}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
