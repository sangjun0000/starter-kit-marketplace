'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useMarketplaceStore, useHydrated } from '@/store/marketplaceStore';
import type { KitCategory } from '@/types';

interface OnboardingBannerProps {
  locale: 'ko' | 'en';
  className?: string;
}

const QUICK_ROLES: { id: KitCategory; label: { ko: string; en: string }; emoji: string }[] = [
  { id: 'website', label: { ko: '웹사이트 제작', en: 'Website' }, emoji: '🌐' },
  { id: 'frontend', label: { ko: '개발자', en: 'Developer' }, emoji: '💻' },
  { id: 'data', label: { ko: '데이터 분석', en: 'Data' }, emoji: '📊' },
  { id: 'content', label: { ko: '블로거', en: 'Blogger' }, emoji: '✍️' },
  { id: 'backend', label: { ko: '백엔드', en: 'Backend' }, emoji: '⚙️' },
];

export function OnboardingBanner({ locale, className }: OnboardingBannerProps) {
  const [visible, setVisible] = useState(false);
  const hydrated = useHydrated();
  const { onboardingCompleted, completeOnboarding, setSelectedRole } = useMarketplaceStore();
  const router = useRouter();

  useEffect(() => {
    // Show banner only on first visit, after hydration
    if (hydrated && !onboardingCompleted) {
      setVisible(true);
    }
  }, [hydrated, onboardingCompleted]);

  if (!hydrated || !visible || onboardingCompleted) return null;

  const handleDismiss = () => {
    setVisible(false);
    completeOnboarding();
  };

  const handleRoleSelect = (role: KitCategory) => {
    setSelectedRole(role);
    completeOnboarding();
    setVisible(false);
    router.push(`/${locale}/browse/${role}`);
  };

  const { t } = useI18n();
  const tStrings = {
    title: t('onboarding.title'),
    subtitle: t('onboarding.subtitle'),
    dismiss: t('onboarding.dismiss'),
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4 sm:px-6',
        className,
      )}
      role="complementary"
      aria-label={locale === 'ko' ? '온보딩 배너' : 'Onboarding banner'}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={tStrings.dismiss}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-white/60 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex items-start gap-3 mb-3 pr-8">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{tStrings.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{tStrings.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pl-0 sm:pl-11" role="list" aria-label={locale === 'ko' ? '역할 선택' : 'Select role'}>
        {QUICK_ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            role="listitem"
            onClick={() => handleRoleSelect(role.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200',
              'px-3 py-1.5 text-sm font-medium text-slate-700',
              'hover:border-blue-300 hover:bg-white hover:text-blue-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              'transition-colors min-h-[44px]',
            )}
          >
            <span aria-hidden="true">{role.emoji}</span>
            {locale === 'ko' ? role.label.ko : role.label.en}
          </button>
        ))}
      </div>
    </div>
  );
}
