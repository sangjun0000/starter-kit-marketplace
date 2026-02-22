'use client';

import { usePopularKits } from '@/hooks/useKits';
import { KitGrid } from '@/features/kits/KitGrid';

interface PopularKitsSectionProps {
  locale: 'ko' | 'en';
}

export function PopularKitsSection({ locale }: PopularKitsSectionProps) {
  const { data, isLoading } = usePopularKits(6);

  return (
    <KitGrid
      kits={data?.data ?? []}
      locale={locale}
      loading={isLoading}
      emptyMessage={locale === 'ko' ? '인기 Kit이 없습니다.' : 'No popular kits found.'}
    />
  );
}
