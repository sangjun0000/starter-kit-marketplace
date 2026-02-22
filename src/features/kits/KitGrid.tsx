import { cn } from '@/lib/utils';
import { KitCard } from './KitCard';
import type { KitSummary, InstallState } from '@/types';

interface KitGridProps {
  kits: KitSummary[];
  variant?: 'card' | 'list';
  locale: 'ko' | 'en';
  installStates?: Record<string, InstallState>;
  onInstallClick?: (kitId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function KitCardSkeleton({ variant = 'card' }: { variant?: 'card' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 animate-pulse">
        <div className="h-12 w-12 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 rounded bg-slate-100" />
          <div className="h-3 w-3/5 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-20 rounded-full bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-12 w-12 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 rounded bg-slate-100" />
          <div className="h-3 w-2/5 rounded bg-slate-100" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-14 rounded-full bg-slate-100" />
        <div className="h-9 w-20 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export function KitGrid({
  kits,
  variant = 'card',
  locale,
  installStates = {},
  onInstallClick,
  loading = false,
  emptyMessage,
  className,
}: KitGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          variant === 'card'
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-3',
          className,
        )}
        aria-busy="true"
        aria-label={locale === 'ko' ? 'Kit 목록 로딩 중' : 'Loading kits'}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <KitCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (kits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-4xl">📦</div>
        <p className="text-slate-500 text-sm">
          {emptyMessage ?? (locale === 'ko' ? 'Kit이 없습니다.' : 'No kits found.')}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === 'card'
          ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
          : 'flex flex-col gap-3',
        className,
      )}
      role="list"
      aria-label={locale === 'ko' ? 'Kit 목록' : 'Kit list'}
    >
      {kits.map((kit) => (
        <div key={kit.id} role="listitem">
          <KitCard
            kit={kit}
            variant={variant}
            installState={installStates[kit.id] ?? 'idle'}
            onInstallClick={onInstallClick}
            locale={locale}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}
