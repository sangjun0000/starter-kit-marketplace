'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useKitList } from '@/hooks/useKits';
import { KitGrid } from '@/features/kits/KitGrid';
import { FilterPanel } from '@/features/search/FilterPanel';
import { cn } from '@/lib/utils';
import type { KitCategory, KitDifficulty, KitType } from '@/types';

type Locale = 'ko' | 'en';

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

const CATEGORY_NAMES: Record<string, { ko: string; en: string }> = {
  website: { ko: '웹사이트 제작', en: 'Website Builder' },
  frontend: { ko: '프론트엔드', en: 'Frontend' },
  backend: { ko: '백엔드', en: 'Backend' },
  fullstack: { ko: '풀스택', en: 'Full Stack' },
  devops: { ko: 'DevOps', en: 'DevOps' },
  mobile: { ko: '모바일', en: 'Mobile' },
  data: { ko: '데이터 분석', en: 'Data Analysis' },
  content: { ko: '콘텐츠 제작', en: 'Content Creation' },
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = use(params);
  const typedLocale = locale as Locale;
  const typedCategory = category as KitCategory;

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [filters, setFilters] = useState({
    difficulty: undefined as KitDifficulty | undefined,
    type: undefined as KitType | undefined,
    sort: 'popular' as 'popular' | 'newest' | 'rating' | 'name',
  });

  const { data, isLoading } = useKitList({
    category: typedCategory,
    difficulty: filters.difficulty,
    type: filters.type,
    sort: filters.sort,
  });

  const categoryName = CATEGORY_NAMES[category];
  const displayName = categoryName
    ? (typedLocale === 'ko' ? categoryName.ko : categoryName.en)
    : category;

  const t = typedLocale === 'ko'
    ? { home: '홈', browse: '탐색', results: '개의 Kit', gridView: '그리드', listView: '목록' }
    : { home: 'Home', browse: 'Browse', results: ' Kits', gridView: 'Grid', listView: 'List' };

  const total = data?.pagination.total ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500" aria-label="breadcrumb">
        <Link href={`/${typedLocale}`} className="hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors">
          {t.home}
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
        <Link href={`/${typedLocale}/browse`} className="hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors">
          {t.browse}
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
        <span className="font-medium text-slate-700">{displayName}</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{displayName}</h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-slate-500">
              {total}{t.results}
            </p>
          )}
        </div>

        {/* View toggle */}
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 p-1 bg-white">
          <button
            type="button"
            onClick={() => setViewMode('card')}
            aria-pressed={viewMode === 'card'}
            aria-label={t.gridView}
            className={cn(
              'rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-700',
            )}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            aria-label={t.listView}
            className={cn(
              'rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-700',
            )}
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters */}
        <FilterPanel
          filters={{ ...filters, category: typedCategory }}
          onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          locale={typedLocale}
          className="w-full shrink-0 lg:w-56"
        />

        {/* Kit Grid */}
        <div className="flex-1 min-w-0">
          <KitGrid
            kits={data?.data ?? []}
            variant={viewMode}
            locale={typedLocale}
            loading={isLoading}
            emptyMessage={
              typedLocale === 'ko'
                ? '조건에 맞는 Kit이 없습니다.'
                : 'No kits match your filters.'
            }
          />
        </div>
      </div>
    </div>
  );
}
