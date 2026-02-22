'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import type { KitCategory } from '@/types';

interface RoleOption {
  id: KitCategory;
  label: { ko: string; en: string };
  emoji: string;
}

interface RoleQuestionCardProps {
  locale: 'ko' | 'en';
  options?: RoleOption[];
  className?: string;
}

const DEFAULT_ROLES: RoleOption[] = [
  { id: 'website', label: { ko: '웹사이트를 만들고 싶어요', en: 'I want to build a website' }, emoji: '🌐' },
  { id: 'frontend', label: { ko: '프론트엔드 개발자예요', en: 'I\'m a frontend developer' }, emoji: '💻' },
  { id: 'backend', label: { ko: '백엔드 개발자예요', en: 'I\'m a backend developer' }, emoji: '⚙️' },
  { id: 'data', label: { ko: '데이터를 분석해요', en: 'I analyze data' }, emoji: '📊' },
  { id: 'content', label: { ko: '콘텐츠를 만들어요', en: 'I create content' }, emoji: '✍️' },
  { id: 'mobile', label: { ko: '모바일 앱을 개발해요', en: 'I build mobile apps' }, emoji: '📱' },
];

export function RoleQuestionCard({ locale, options, className }: RoleQuestionCardProps) {
  const roles = options ?? DEFAULT_ROLES;
  const router = useRouter();
  const { selectedRole, setSelectedRole } = useMarketplaceStore();

  const handleSelect = (roleId: KitCategory) => {
    setSelectedRole(roleId);
    router.push(`/${locale}/browse/${roleId}`);
  };

  const title = locale === 'ko' ? '나는 ___ 이다' : 'I am a ___';
  const subtitle = locale === 'ko'
    ? '해당하는 역할을 선택해주세요'
    : 'Select the option that fits you best';

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6',
        className,
      )}
    >
      <div className="mb-5 text-center">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label={title}>
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(role.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm',
                'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                'min-h-[54px]',
                isSelected
                  ? 'border-blue-500 bg-blue-50 font-medium text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700',
              )}
            >
              <span className="text-xl shrink-0" aria-hidden="true">{role.emoji}</span>
              <span>{locale === 'ko' ? role.label.ko : role.label.en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
