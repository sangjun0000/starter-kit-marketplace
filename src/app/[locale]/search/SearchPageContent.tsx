'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/features/search/SearchBar';
import { FilterPanel } from '@/features/search/FilterPanel';
import { KitGrid } from '@/features/kits/KitGrid';
import { useKitList } from '@/hooks/useKits';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import type { KitCategory, KitDifficulty, KitType } from '@/types';

interface SearchPageContentProps {
  locale: 'ko' | 'en';
}

export function SearchPageContent({ locale }: SearchPageContentProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const { addRecentSearch } = useMarketplaceStore();

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: undefined as KitCategory | undefined,
    difficulty: undefined as KitDifficulty | undefined,
    type: undefined as KitType | undefined,
    sort: 'popular' as 'popular' | 'newest' | 'rating' | 'name',
  });

  const { data, isLoading } = useKitList({
    search: query || undefined,
    category: filters.category,
    difficulty: filters.difficulty,
    type: filters.type,
    sort: filters.sort,
  });

  useEffect(() => {
    if (initialQuery) {
      addRecentSearch(initialQuery);
    }
  }, [initialQuery, addRecentSearch]);

  const t = locale === 'ko'
    ? {
        title: '검색',
        resultsFor: `"${query}" 검색 결과`,
        results: '개의 Kit',
        noResults: '검색 결과가 없습니다.',
        noResultsHint: '다른 검색어를 시도해보세요.',
        requestKit: '커뮤니티에 Kit 요청하기',
      }
    : {
        title: 'Search',
        resultsFor: `Results for "${query}"`,
        results: ' Kits',
        noResults: 'No results found.',
        noResultsHint: 'Try a different search term.',
        requestKit: 'Request a kit from the community',
      };

  const total = data?.pagination.total ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{t.title}</h1>
        <SearchBar
          locale={locale}
          defaultValue={initialQuery}
          onSearch={(q) => setQuery(q)}
          size="lg"
        />
        {query && !isLoading && (
          <p className="mt-3 text-sm text-slate-500">
            {t.resultsFor} &mdash; {total}{t.results}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FilterPanel
          filters={filters}
          onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          locale={locale}
          className="w-full shrink-0 lg:w-56"
        />

        <div className="flex-1 min-w-0">
          {!isLoading && total === 0 && query ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="text-4xl">🔍</div>
              <div>
                <p className="font-medium text-slate-700">{t.noResults}</p>
                <p className="text-sm text-slate-400 mt-1">{t.noResultsHint}</p>
              </div>
              <a
                href={`/${locale}/submit`}
                className="text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {t.requestKit}
              </a>
            </div>
          ) : (
            <KitGrid
              kits={data?.data ?? []}
              locale={locale}
              loading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
