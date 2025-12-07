import { Badge } from '@components/shadcn/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/shadcn/card';
import { CodeBlock } from '@components/shadcn/code-block';
import { Check } from 'lucide-react';
import { apiDocsConfig } from '../config';

export function ApiOverview() {
  const requestExample = `curl -X POST \\
  ${apiDocsConfig.endpoint.url} \\
  -H "Content-Type: ${apiDocsConfig.request.contentType}" \\
  -d '{"name1": "Alice", "name2": "Bob"}'`;

  const responseExample = JSON.stringify(apiDocsConfig.response.example, null, 2);

  return (
    <Card className="border-border bg-surface-container-low shadow-sm">
      <CardHeader className="flex flex-col gap-3 text-left">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-primary/15 text-primary border-primary/30 border text-[11px] tracking-wide">
            {apiDocsConfig.endpoint.method}
          </Badge>
          <Badge variant="outline" className="border-border bg-surface-container font-mono text-[11px]">
            {apiDocsConfig.endpoint.path}
          </Badge>
          <span className="text-xs font-medium text-green-700 dark:text-green-400" aria-live="polite">
            ● {apiDocsConfig.hero.status.uptime} uptime
          </span>
        </div>
        <CardTitle className="text-foreground text-2xl leading-none font-semibold tracking-tight">
          {apiDocsConfig.endpoint.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground max-w-3xl text-base">
          {apiDocsConfig.endpoint.description}. {apiDocsConfig.overview.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-10 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="min-w-0 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="min-w-0">
              <p className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">Request format</p>
              <CodeBlock language="bash" filename="example.sh" code={requestExample} />
              <dl className="text-muted-foreground mt-4 space-y-2 text-sm">
                {Object.entries(apiDocsConfig.request.details).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <dt className="shrink-0">{key}</dt>
                    <dd className="font-mono text-xs break-all sm:text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0">
              <p className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">Response format</p>
              <CodeBlock language="json" filename="response.json" code={responseExample} />
              <ul className="text-muted-foreground mt-4 space-y-1 text-sm">
                {apiDocsConfig.response.results.map((result) => (
                  <li key={result}>• {result}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">Request lifecycle</p>
            <ol className="space-y-4">
              {apiDocsConfig.overview.steps.map((step) => (
                <li
                  key={step.title}
                  className="bg-surface-container hover:bg-surface-container-high hover:border-primary/30 border-border rounded-2xl border p-4 transition-all duration-300"
                >
                  <span className="text-foreground text-sm font-semibold">{step.title}</span>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-wide uppercase">Guaranteed safeguards</p>
            <ul className="space-y-3">
              {apiDocsConfig.overview.guarantees.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                    <Check size={14} />
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-xs">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
