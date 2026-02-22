import Link from 'next/link';
import { Package } from 'lucide-react';

interface FooterProps {
  locale: 'ko' | 'en';
}

export function Footer({ locale }: FooterProps) {
  const t = locale === 'ko'
    ? {
        tagline: 'Claude Code를 위한 역할별 도구 모음',
        explore: '탐색',
        browse: '카테고리 둘러보기',
        search: '검색',
        myKits: '내 Kit',
        community: '커뮤니티',
        submit: 'Kit 제출',
        support: '지원',
        docs: '문서',
        faq: '자주 묻는 질문',
        copyright: '© 2026 Starter Kit Marketplace. All rights reserved.',
      }
    : {
        tagline: 'Role-based tools for Claude Code',
        explore: 'Explore',
        browse: 'Browse Categories',
        search: 'Search',
        myKits: 'My Kits',
        community: 'Community',
        submit: 'Submit a Kit',
        support: 'Support',
        docs: 'Documentation',
        faq: 'FAQ',
        copyright: '© 2026 Starter Kit Marketplace. All rights reserved.',
      };

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 font-bold text-slate-900 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <Package className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span>Starter Kit</span>
            </Link>
            <p className="mt-2 text-sm text-slate-500">{t.tagline}</p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t.explore}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={`/${locale}/browse`}
                  className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
                >
                  {t.browse}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/search`}
                  className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
                >
                  {t.search}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/my-kits`}
                  className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
                >
                  {t.myKits}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t.community}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={`/${locale}/submit`}
                  className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
                >
                  {t.submit}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t.support}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://docs.anthropic.com/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
                >
                  {t.docs}
                </a>
              </li>
              <li>
                <a
                  href="https://support.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
                >
                  {t.faq}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-8">
          <p className="text-center text-xs text-slate-400">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
