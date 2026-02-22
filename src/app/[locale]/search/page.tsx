import { Suspense } from 'react';
import { SearchPageContent } from './SearchPageContent';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageContent locale={locale as 'ko' | 'en'} />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mb-4" />
        <div className="h-12 w-full bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
