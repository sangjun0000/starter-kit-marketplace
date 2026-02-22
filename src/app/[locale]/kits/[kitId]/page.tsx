'use client';

import { use } from 'react';
import { useKitDetail } from '@/hooks/useKits';
import { KitDetail } from '@/features/kits/KitDetail';
import { ReviewSection } from '@/features/reviews/ReviewSection';
import { Loader2 } from 'lucide-react';

type Locale = 'ko' | 'en';

interface KitDetailPageProps {
  params: Promise<{ locale: string; kitId: string }>;
}

export default function KitDetailPage({ params }: KitDetailPageProps) {
  const { locale, kitId } = use(params);
  const typedLocale = locale as Locale;

  const { data: kit, isLoading, isError } = useKitDetail(kitId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <span>{typedLocale === 'ko' ? 'Kit 정보를 불러오는 중...' : 'Loading kit details...'}</span>
        </div>
      </div>
    );
  }

  if (isError || !kit) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">📦</p>
          <p className="text-slate-500">
            {typedLocale === 'ko' ? 'Kit을 찾을 수 없습니다.' : 'Kit not found.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <KitDetail kit={kit} locale={typedLocale} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-32 lg:pb-8">
        <ReviewSection kitName={kitId} locale={typedLocale} />
      </div>
    </>
  );
}
