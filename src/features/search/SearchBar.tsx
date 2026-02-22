'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Search, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplaceStore } from '@/store/marketplaceStore';

interface SearchBarProps {
  locale: 'ko' | 'en';
  defaultValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({
  locale,
  defaultValue = '',
  onSearch,
  className,
  autoFocus = false,
  size = 'md',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useI18n();
  const { recentSearches, addRecentSearch } = useMarketplaceStore();

  const placeholder = t('nav.searchPlaceholder');

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    addRecentSearch(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      router.push(`/${locale}/search?q=${encodeURIComponent(suggestion)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const sizeClasses = {
    sm: 'py-2 pl-9 pr-4 text-sm',
    md: 'py-2.5 pl-10 pr-10 text-base',
    lg: 'py-3.5 pl-12 pr-12 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4 left-2.5',
    md: 'h-4 w-4 left-3',
    lg: 'h-5 w-5 left-3.5',
  };

  const filteredRecent = recentSearches.filter((s) =>
    query.length === 0 || s.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form role="search" onSubmit={handleSubmit}>
        <label htmlFor="kit-search" className="sr-only">
          {locale === 'ko' ? 'Kit 검색' : 'Search kits'}
        </label>
        <div className="relative">
          <Search
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none',
              iconSizeClasses[size],
            )}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="kit-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? 'search-suggestions' : undefined}
            aria-expanded={showSuggestions && filteredRecent.length > 0}
            className={cn(
              'w-full rounded-full border border-slate-200 bg-slate-50 text-slate-900',
              'placeholder:text-slate-400',
              'focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'transition-colors',
              sizeClasses[size],
            )}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={locale === 'ko' ? '검색어 지우기' : 'Clear search'}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-slate-600',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full',
              )}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {showSuggestions && filteredRecent.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label={locale === 'ko' ? '최근 검색어' : 'Recent searches'}
          className="absolute top-full z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <li className="px-3 py-1.5">
            <span className="text-xs font-medium text-slate-400">
              {locale === 'ko' ? '최근 검색어' : 'Recent searches'}
            </span>
          </li>
          {filteredRecent.map((suggestion) => (
            <li key={suggestion} role="option" aria-selected={false}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50 transition-colors min-h-[44px]"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
