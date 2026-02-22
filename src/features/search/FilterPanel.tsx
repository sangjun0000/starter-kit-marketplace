'use client';

import { cn } from '@/lib/utils';
import type { KitCategory, KitDifficulty, KitType } from '@/types';

interface FilterState {
  category?: KitCategory;
  difficulty?: KitDifficulty;
  type?: KitType;
  sort: 'popular' | 'newest' | 'rating' | 'name';
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  locale: 'ko' | 'en';
  className?: string;
}

const CATEGORIES: { id: KitCategory; label: { ko: string; en: string } }[] = [
  { id: 'website', label: { ko: '웹사이트 제작', en: 'Website Builder' } },
  { id: 'frontend', label: { ko: '프론트엔드', en: 'Frontend' } },
  { id: 'backend', label: { ko: '백엔드', en: 'Backend' } },
  { id: 'fullstack', label: { ko: '풀스택', en: 'Full Stack' } },
  { id: 'devops', label: { ko: 'DevOps', en: 'DevOps' } },
  { id: 'mobile', label: { ko: '모바일', en: 'Mobile' } },
  { id: 'data', label: { ko: '데이터 분석', en: 'Data Analysis' } },
  { id: 'content', label: { ko: '콘텐츠 제작', en: 'Content Creation' } },
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function FilterPanel({ filters, onFilterChange, locale, className }: FilterPanelProps) {
  const t = locale === 'ko'
    ? {
        title: '필터',
        category: '카테고리',
        allCategories: '전체',
        difficulty: '난이도',
        allDifficulties: '전체',
        easy: '쉬움',
        medium: '보통',
        hard: '어려움',
        type: '유형',
        allTypes: '전체',
        official: '공식',
        community: '커뮤니티',
        sort: '정렬',
        popular: '인기순',
        newest: '최신순',
        rating: '평점순',
        name: '이름순',
        reset: '필터 초기화',
      }
    : {
        title: 'Filters',
        category: 'Category',
        allCategories: 'All',
        difficulty: 'Difficulty',
        allDifficulties: 'All',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        type: 'Type',
        allTypes: 'All',
        official: 'Official',
        community: 'Community',
        sort: 'Sort by',
        popular: 'Most Popular',
        newest: 'Newest',
        rating: 'Highest Rated',
        name: 'Name',
        reset: 'Reset Filters',
      };

  const hasActiveFilters = filters.category || filters.difficulty || filters.type;

  const buttonClass = (active: boolean) =>
    cn(
      'w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]',
      active
        ? 'bg-blue-600 text-white font-medium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    );

  return (
    <aside
      className={cn('space-y-6', className)}
      aria-label={locale === 'ko' ? '검색 필터' : 'Search filters'}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{t.title}</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onFilterChange({ category: undefined, difficulty: undefined, type: undefined })}
            className="text-xs text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {t.reset}
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title={t.sort}>
        <div className="space-y-1">
          {(
            [
              { value: 'popular', label: t.popular },
              { value: 'newest', label: t.newest },
              { value: 'rating', label: t.rating },
              { value: 'name', label: t.name },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange({ sort: value })}
              aria-pressed={filters.sort === value}
              className={buttonClass(filters.sort === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title={t.category}>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: undefined })}
            aria-pressed={!filters.category}
            className={buttonClass(!filters.category)}
          >
            {t.allCategories}
          </button>
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange({ category: id })}
              aria-pressed={filters.category === id}
              className={buttonClass(filters.category === id)}
            >
              {locale === 'ko' ? label.ko : label.en}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title={t.difficulty}>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ difficulty: undefined })}
            aria-pressed={!filters.difficulty}
            className={buttonClass(!filters.difficulty)}
          >
            {t.allDifficulties}
          </button>
          {(
            [
              { value: 1 as KitDifficulty, label: t.easy },
              { value: 2 as KitDifficulty, label: t.medium },
              { value: 3 as KitDifficulty, label: t.hard },
            ]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange({ difficulty: value })}
              aria-pressed={filters.difficulty === value}
              className={buttonClass(filters.difficulty === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Type */}
      <FilterSection title={t.type}>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ type: undefined })}
            aria-pressed={!filters.type}
            className={buttonClass(!filters.type)}
          >
            {t.allTypes}
          </button>
          {(
            [
              { value: 'official' as KitType, label: t.official },
              { value: 'community' as KitType, label: t.community },
            ]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange({ type: value })}
              aria-pressed={filters.type === value}
              className={buttonClass(filters.type === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
