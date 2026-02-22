'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Package, ChevronRight, AlertCircle, Globe, Code, Server, Layers,
  Cloud, Smartphone, BarChart2, PenTool,
} from 'lucide-react';
import { cn, localize, formatNumber } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { InstallButton } from './InstallButton';
import { InstallModal } from './InstallModal';
import { KitToolList } from './KitToolList';
import { installService } from '@/services/install.service';
import type { KitDetail as KitDetailType, InstallSession, InstallState } from '@/types';

interface KitDetailProps {
  kit: KitDetailType;
  locale: 'ko' | 'en';
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Code, Server, Layers, Cloud, Smartphone, BarChart2, PenTool, Package,
};

export function KitDetail({ kit, locale }: KitDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [session, setSession] = useState<InstallSession | null>(null);
  const [installState, setInstallState] = useState<InstallState>('idle');

  const tKit = useTranslations('kit');
  const tNav = useTranslations('nav');
  const IconComponent = ICON_MAP[kit.icon] ?? Package;
  const name = localize(kit.displayName, locale);
  const description = localize(kit.description, locale);

  const t = {
    breadcrumbHome: tNav('home'),
    breadcrumbBrowse: tNav('browse'),
    official: locale === 'ko' ? '공식' : 'Official',
    version: tKit('version'),
    installs: tKit('install'),
    requirements: tKit('requirements'),
    tools: tKit('includes'),
    noRequirements: locale === 'ko' ? '특별한 요구사항 없음' : 'No special requirements',
  };

  const handleInstall = async () => {
    setInstallState('generating');
    try {
      const newSession = await installService.createSession(kit.name);
      setSession(newSession);
      setInstallState('ready');
      setIsModalOpen(true);
    } catch {
      setInstallState('error');
    }
  };

  const handleDeeplinkLaunch = () => {
    if (!session) return;
    const deeplink = installService.generateDeeplink(session);
    window.location.href = deeplink;
    setInstallState('installing');
    setIsModalOpen(false);
  };

  const handleCliCopy = () => {
    setInstallState('installing');
  };

  const hasRequirements = kit.requires.claudeCode || kit.requires.bkit || kit.requires.node;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500" aria-label="breadcrumb">
        <Link href={`/${locale}`} className="hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors">
          {t.breadcrumbHome}
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
        <Link href={`/${locale}/browse/${kit.category}`} className="hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors capitalize">
          {kit.category}
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
        <span className="font-medium text-slate-700 truncate">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <IconComponent className="h-8 w-8" aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                  {kit.isOfficial && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                      {t.official}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {t.version} {kit.version} · {kit.author.name}
                </p>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <div
                    role="img"
                    aria-label={`평점 ${kit.rating.toFixed(1)}점 / 5점, ${kit.reviewCount}개 평가`}
                    className="flex items-center gap-1.5"
                  >
                    <StarRating value={kit.rating} readOnly size="md" showValue />
                    <span className="text-sm text-slate-400">({kit.reviewCount})</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-sm text-slate-500">
                    {formatNumber(kit.installCount)} {t.installs}
                  </span>
                  <DifficultyBadge difficulty={kit.difficulty} locale={locale} size="sm" />
                </div>
              </div>
            </div>

            <p className="mt-4 text-slate-600 leading-relaxed">{description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {kit.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.tools}</h2>
            <KitToolList tools={kit.includes} locale={locale} />
          </div>

          {/* Requirements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.requirements}</h2>
            {hasRequirements ? (
              <ul className="space-y-2">
                {kit.requires.claudeCode && (
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
                    Claude Code {kit.requires.claudeCode}+
                  </li>
                )}
                {kit.requires.node && (
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
                    Node.js {kit.requires.node}+
                  </li>
                )}
                {kit.requires.bkit && (
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
                    bkit {kit.requires.bkit}+
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">{t.noRequirements}</p>
            )}
          </div>
        </div>

        {/* Sidebar Desktop sticky CTA */}
        <div className="space-y-4">
          <div
            className={cn(
              'hidden lg:block sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
            )}
          >
            <InstallButton
              kitId={kit.id}
              kitName={kit.displayName}
              state={installState}
              onInstall={handleInstall}
              fullWidth
              size="lg"
              locale={locale}
            />
            <p className="mt-3 text-center text-xs text-slate-400">
              {formatNumber(kit.installCount)} {t.installs}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur p-4 safe-area-inset-bottom"
        aria-label={locale === 'ko' ? '설치 버튼 영역' : 'Install button area'}
      >
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <StarRating value={kit.rating} readOnly size="sm" />
            <span className="text-xs text-slate-500">{formatNumber(kit.installCount)} {t.installs}</span>
          </div>
          <InstallButton
            kitId={kit.id}
            kitName={kit.displayName}
            state={installState}
            onInstall={handleInstall}
            size="md"
            locale={locale}
          />
        </div>
      </div>

      {/* Install Modal */}
      <InstallModal
        kit={kit}
        session={session}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeeplinkLaunch={handleDeeplinkLaunch}
        onCliCopy={handleCliCopy}
        locale={locale}
      />
    </div>
  );
}
