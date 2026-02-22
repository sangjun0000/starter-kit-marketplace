'use client';

import { use } from 'react';
import Link from 'next/link';
import { Package, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplaceStore } from '@/store/marketplaceStore';

type Locale = 'ko' | 'en';

interface MyKitsPageProps {
  params: Promise<{ locale: string }>;
}

function formatDate(dateStr: string, locale: Locale): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function MyKitsPage({ params }: MyKitsPageProps) {
  const { locale } = use(params);
  const typedLocale = locale as Locale;
  const { installedKits, removeInstalledKit } = useMarketplaceStore();

  const t = typedLocale === 'ko'
    ? {
        title: '내 Kit',
        subtitle: '설치된 Kit 목록',
        empty: '아직 설치된 Kit이 없습니다.',
        emptyHint: '마켓플레이스에서 Kit을 설치해보세요.',
        browseCta: 'Kit 탐색하기',
        installed: '설치됨',
        installedAt: '설치일',
        version: '버전',
        remove: '제거',
        update: '업데이트',
        status: { installed: '최신 버전', update_available: '업데이트 가능', error: '오류' },
      }
    : {
        title: 'My Kits',
        subtitle: 'Installed kits',
        empty: 'No kits installed yet.',
        emptyHint: 'Browse the marketplace to find and install kits.',
        browseCta: 'Browse Kits',
        installed: 'Installed',
        installedAt: 'Installed',
        version: 'Version',
        remove: 'Remove',
        update: 'Update',
        status: { installed: 'Up to date', update_available: 'Update available', error: 'Error' },
      };

  if (installedKits.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">{t.title}</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Package className="h-10 w-10" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">{t.empty}</p>
            <p className="mt-1 text-sm text-slate-400">{t.emptyHint}</p>
          </div>
          <Link
            href={`/${typedLocale}/browse`}
            className={cn(
              'rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white',
              'hover:bg-blue-700 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            )}
          >
            {t.browseCta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {installedKits.length} {t.subtitle}
        </p>
      </div>

      <div className="space-y-3" role="list" aria-label={t.title}>
        {installedKits.map((kit) => {
          const status = kit.status ?? 'installed';
          const StatusIcon =
            status === 'installed' ? CheckCircle :
            status === 'error' ? AlertCircle :
            RefreshCw;
          const statusColor =
            status === 'installed' ? 'text-green-600' :
            status === 'error' ? 'text-red-500' :
            'text-amber-500';

          return (
            <article
              key={kit.kitId}
              role="listitem"
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Package className="h-6 w-6" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/${typedLocale}/kits/${kit.kitName}`}
                    className="font-semibold text-slate-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors text-sm"
                  >
                    {kit.kitName}
                  </Link>
                  <span className={cn('flex items-center gap-1 text-xs font-medium', statusColor)}>
                    <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.status[status]}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
                  <span>{t.version} {kit.version}</span>
                  <span>·</span>
                  <span>{t.installedAt} {formatDate(kit.installedAt, typedLocale)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => removeInstalledKit(kit.kitId)}
                  aria-label={`${kit.kitName} ${t.remove}`}
                  className={cn(
                    'rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                    'transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
                  )}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
