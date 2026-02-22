import { CategorySelector } from '@/features/categories/CategorySelector';

type Locale = 'ko' | 'en';

interface BrowsePageProps {
  params: Promise<{ locale: string }>;
}

export default async function BrowsePage({ params }: BrowsePageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const title = typedLocale === 'ko' ? '카테고리 탐색' : 'Browse Categories';
  const subtitle = typedLocale === 'ko'
    ? '역할을 선택해 맞춤 Kit을 찾아보세요'
    : 'Choose your role to discover the right kits';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>
      <CategorySelector locale={typedLocale} />
    </div>
  );
}
