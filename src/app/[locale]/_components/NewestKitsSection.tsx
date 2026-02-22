'use client';

import { useNewestKits } from '@/hooks/useKits';
import { KitGrid } from '@/features/kits/KitGrid';

interface NewestKitsSectionProps {
  locale: 'ko' | 'en';
}

export function NewestKitsSection({ locale }: NewestKitsSectionProps) {
  const { data, isLoading } = useNewestKits(6);

  return (
    <KitGrid
      kits={data?.data ?? []}
      locale={locale}
      loading={isLoading}
      emptyMessage={locale === 'ko' ? '최신 Kit이 없습니다.' : 'No newest kits found.'}
    />
  );
}
