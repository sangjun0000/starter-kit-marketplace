import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import koMessages from '@/messages/ko/common.json';
import enMessages from '@/messages/en/common.json';
import { CategorySelector } from '@/features/categories/CategorySelector';
import { OnboardingBanner } from '@/features/onboarding/OnboardingBanner';
import { PopularKitsSection } from './_components/PopularKitsSection';
import { NewestKitsSection } from './_components/NewestKitsSection';

type Locale = 'ko' | 'en';

const allMessages = { ko: koMessages, en: enMessages };

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const messages = allMessages[typedLocale] ?? allMessages.ko;
  const home = messages.home;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Onboarding Banner (client-only, shown on first visit) */}
      <OnboardingBanner locale={typedLocale} />

      {/* Hero: Category Selector */}
      <CategorySelector locale={typedLocale} />

      {/* Popular Kits */}
      <section aria-labelledby="popular-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="popular-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
            {home.popularKits}
          </h2>
          <Link
            href={`/${typedLocale}/browse?sort=popular`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
          >
            {home.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <PopularKitsSection locale={typedLocale} />
      </section>

      {/* Newest Kits */}
      <section aria-labelledby="newest-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="newest-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
            {home.newestKits}
          </h2>
          <Link
            href={`/${typedLocale}/browse?sort=newest`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
          >
            {home.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <NewestKitsSection locale={typedLocale} />
      </section>
    </div>
  );
}
