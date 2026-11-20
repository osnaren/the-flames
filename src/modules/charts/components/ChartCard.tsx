import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Shared surface for every chart panel. Entrance is a compositor-only CSS rise. */
export default function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconClassName = 'text-primary bg-primary/10',
  action,
  children,
  className = '',
  delay = 0,
}: ChartCardProps) {
  return (
    <section
      className={`motion-rise border-outline-variant/40 bg-surface-container-low/80 relative flex flex-col rounded-3xl border p-5 shadow-sm sm:p-6 ${className}`}
      style={{ '--rise-delay': `${delay}s` } as CSSProperties}
      aria-label={title}
    >
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-on-surface text-base font-semibold sm:text-lg">{title}</h2>
            {subtitle && <p className="text-on-surface-variant text-xs sm:text-sm">{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}
