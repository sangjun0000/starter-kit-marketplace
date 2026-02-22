'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { CategoryCard } from './CategoryCard';
import { useMarketplaceStore, useHydrated } from '@/store/marketplaceStore';
import type { KitCategory, LocalizedString } from '@/types';

interface CategoryData {
  id: KitCategory;
  name: LocalizedString;
  icon: string;
  description: LocalizedString;
  kitCount: number;
  colorClass: string;
}

interface CategorySelectorProps {
  locale: 'ko' | 'en';
  categories?: CategoryData[];
}

// Default categories with fallback data
const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    id: 'website',
    name: { ko: '웹사이트 제작', en: 'Website Builder' },
    icon: 'Globe',
    description: { ko: '블로그, 포트폴리오, 쇼핑몰 제작', en: 'Blogs, portfolios, e-commerce' },
    kitCount: 8,
    colorClass: 'bg-blue-50',
  },
  {
    id: 'frontend',
    name: { ko: '프론트엔드', en: 'Frontend' },
    icon: 'Code',
    description: { ko: 'React, Next.js, Vue 개발', en: 'React, Next.js, Vue development' },
    kitCount: 12,
    colorClass: 'bg-purple-50',
  },
  {
    id: 'backend',
    name: { ko: '백엔드', en: 'Backend' },
    icon: 'Server',
    description: { ko: 'API, 데이터베이스, 서버 개발', en: 'API, databases, server development' },
    kitCount: 10,
    colorClass: 'bg-green-50',
  },
  {
    id: 'fullstack',
    name: { ko: '풀스택', en: 'Full Stack' },
    icon: 'Layers',
    description: { ko: '프론트엔드 + 백엔드 통합', en: 'Frontend + backend integration' },
    kitCount: 6,
    colorClass: 'bg-amber-50',
  },
  {
    id: 'devops',
    name: { ko: 'DevOps', en: 'DevOps' },
    icon: 'Cloud',
    description: { ko: 'CI/CD, 배포, 인프라 자동화', en: 'CI/CD, deployment, infrastructure' },
    kitCount: 7,
    colorClass: 'bg-red-50',
  },
  {
    id: 'mobile',
    name: { ko: '모바일', en: 'Mobile' },
    icon: 'Smartphone',
    description: { ko: 'iOS, Android, React Native', en: 'iOS, Android, React Native' },
    kitCount: 5,
    colorClass: 'bg-sky-50',
  },
  {
    id: 'data',
    name: { ko: '데이터 분석', en: 'Data Analysis' },
    icon: 'BarChart2',
    description: { ko: '데이터 시각화, ML, 분석 자동화', en: 'Data viz, ML, analysis automation' },
    kitCount: 9,
    colorClass: 'bg-teal-50',
  },
  {
    id: 'content',
    name: { ko: '콘텐츠 제작', en: 'Content Creation' },
    icon: 'PenTool',
    description: { ko: '글쓰기, 블로깅, SNS 콘텐츠', en: 'Writing, blogging, social content' },
    kitCount: 4,
    colorClass: 'bg-yellow-50',
  },
];

export function CategorySelector({ locale, categories }: CategorySelectorProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { selectedRole, setSelectedRole } = useMarketplaceStore();
  const { t } = useI18n();
  const displayCategories = categories ?? DEFAULT_CATEGORIES;

  const handleCategoryClick = (categoryId: KitCategory) => {
    setSelectedRole(categoryId);
    router.push(`/${locale}/browse/${categoryId}`);
  };

  const title = t('home.heroTitle');
  const subtitle = t('home.heroSubtitle');

  return (
    <section aria-labelledby="category-selector-heading">
      <div className="mb-8 text-center">
        <h2
          id="category-selector-heading"
          className="text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 text-slate-500 text-sm sm:text-base">{subtitle}</p>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
        role="list"
        aria-label={locale === 'ko' ? '카테고리 목록' : 'Category list'}
      >
        {displayCategories.map((category) => (
          <div key={category.id} role="listitem">
            <CategoryCard
              category={category}
              isSelected={hydrated && selectedRole === category.id}
              onClick={handleCategoryClick}
              locale={locale}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
