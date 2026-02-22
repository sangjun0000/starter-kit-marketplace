import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '@/app/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import koMessages from '@/messages/ko/common.json';
import enMessages from '@/messages/en/common.json';

const allMessages: Record<string, typeof koMessages> = { ko: koMessages, en: enMessages };

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const SUPPORTED_LOCALES = ['ko', 'en'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';
  return {
    title: isKo ? 'Starter Kit 마켓플레이스' : 'Starter Kit Marketplace',
    description: isKo
      ? 'Claude Code를 위한 역할별 도구 모음'
      : 'Role-based tools for Claude Code',
  };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const messages = allMessages[typedLocale] ?? allMessages.ko;

  return (
    <html lang={typedLocale}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 focus:underline"
        >
          {typedLocale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
        </a>
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col bg-slate-50">
              <Header locale={typedLocale} />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer locale={typedLocale} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
