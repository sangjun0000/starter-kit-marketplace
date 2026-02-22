'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Menu, X, Package, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarketplaceStore } from '@/store/marketplaceStore';

interface HeaderProps {
  locale: 'ko' | 'en';
}

export function Header({ locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const installedKits = useMarketplaceStore((s) => s.installedKits);
  const installedCount = installedKits.length;

  const otherLocale = locale === 'ko' ? 'en' : 'ko';
  // Swap locale segment in current path
  const localeSwitchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const nav = {
    browse: t('browse'),
    myKits: t('myKits'),
    searchPlaceholder: t('searchPlaceholder'),
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-2 font-bold text-slate-900 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            <Package className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <span className="hidden sm:block text-sm font-semibold">
              {locale === 'ko' ? 'Starter Kit' : 'Starter Kit'}
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            role="search"
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg"
          >
            <label htmlFor="header-search" className="sr-only">
              {locale === 'ko' ? 'Kit 검색' : 'Search kits'}
            </label>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="header-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={nav.searchPlaceholder}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
          </form>

          {/* Spacer */}
          <div className="flex-1 md:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label={locale === 'ko' ? '검색 열기' : 'Open search'}
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1" aria-label={locale === 'ko' ? '주요 탐색' : 'Main navigation'}>
              <Link
                href={`/${locale}/browse`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              >
                {nav.browse}
              </Link>

              <Link
                href={`/${locale}/my-kits`}
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                aria-label={`${nav.myKits}${installedCount > 0 ? ` (${installedCount})` : ''}`}
              >
                {nav.myKits}
                {installedCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {installedCount > 9 ? '9+' : installedCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Locale switcher */}
            <Link
              href={localeSwitchPath}
              className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors uppercase"
              aria-label={locale === 'ko' ? '영어로 전환' : '한국어로 전환'}
            >
              {otherLocale.toUpperCase()}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label={mobileMenuOpen
                ? (locale === 'ko' ? '메뉴 닫기' : 'Close menu')
                : (locale === 'ko' ? '메뉴 열기' : 'Open menu')}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="border-t border-slate-100 py-3 md:hidden">
            <form role="search" onSubmit={handleSearch}>
              <label htmlFor="mobile-search" className="sr-only">
                {locale === 'ko' ? 'Kit 검색' : 'Search kits'}
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="mobile-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={nav.searchPlaceholder}
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav
            className="border-t border-slate-100 py-3 md:hidden"
            aria-label={locale === 'ko' ? '모바일 탐색' : 'Mobile navigation'}
          >
            <div className="flex flex-col gap-1">
              <Link
                href={`/${locale}/browse`}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-h-[44px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5 text-slate-400" aria-hidden="true" />
                {nav.browse}
              </Link>

              <Link
                href={`/${locale}/my-kits`}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-h-[44px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-slate-400" aria-hidden="true" />
                {nav.myKits}
                {installedCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {installedCount > 9 ? '9+' : installedCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
