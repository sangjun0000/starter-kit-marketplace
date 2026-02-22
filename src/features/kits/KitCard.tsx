import Link from 'next/link';
import {
  Globe, Code, Server, Layers, Cloud, Smartphone, BarChart2, PenTool, Package,
} from 'lucide-react';
import { cn, localize, formatNumber, difficultyLabel } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { InstallButton } from './InstallButton';
import type { KitSummary, InstallState } from '@/types';

interface KitCardProps {
  kit: KitSummary;
  variant?: 'card' | 'list' | 'featured';
  installState?: InstallState;
  onInstallClick?: (kitId: string) => void;
  locale: 'ko' | 'en';
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Code, Server, Layers, Cloud, Smartphone, BarChart2, PenTool, Package,
};

export function KitCard({
  kit,
  variant = 'card',
  installState = 'idle',
  onInstallClick,
  locale,
  className,
}: KitCardProps) {
  const IconComponent = ICON_MAP[kit.icon] ?? Package;
  const name = localize(kit.displayName, locale);
  const description = localize(kit.description, locale);
  const installLabel = locale === 'ko' ? '설치' : 'installs';
  const officialLabel = locale === 'ko' ? '공식' : 'Official';
  const verifiedLabel = locale === 'ko' ? '인증됨' : 'Verified';
  const diffLabel = difficultyLabel(kit.difficulty, locale);

  if (variant === 'list') {
    return (
      <article
        className={cn(
          'group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4',
          'hover:border-slate-300 hover:shadow-sm transition-all duration-200',
          className,
        )}
        aria-label={`${name} Kit. 난이도: ${diffLabel}. 평점: ${kit.rating.toFixed(1)}점`}
      >
        <Link href={`/${locale}/kits/${kit.name}`} className="flex items-center gap-4 flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <IconComponent className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 id={`kit-name-${kit.id}`} className="font-semibold text-slate-900 text-sm truncate">
                {name}
              </h3>
              {kit.isOfficial && (
                <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  {officialLabel}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500 truncate">{description}</p>
            <div className="mt-1 flex items-center gap-3">
              <StarRating value={kit.rating} readOnly size="sm" />
              <span className="text-xs text-slate-400">
                {formatNumber(kit.installCount)} {installLabel}
              </span>
              <DifficultyBadge difficulty={kit.difficulty} locale={locale} size="sm" />
            </div>
          </div>
        </Link>
        {onInstallClick && (
          <InstallButton
            kitId={kit.id}
            kitName={kit.displayName}
            state={installState}
            onInstall={() => onInstallClick(kit.id)}
            size="sm"
            locale={locale}
            className="shrink-0"
          />
        )}
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl border border-slate-200 bg-white p-5',
        'hover:border-slate-300 hover:shadow-md transition-all duration-200',
        variant === 'featured' && 'lg:flex-row lg:items-center lg:gap-6',
        className,
      )}
      aria-label={`${name} Kit. 난이도: ${diffLabel}. 평점: ${kit.rating.toFixed(1)}점`}
    >
      {/* Icon & Header */}
      <Link
        href={`/${locale}/kits/${kit.name}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
        tabIndex={0}
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
            <IconComponent className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                id={`kit-name-${kit.id}`}
                className="font-semibold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors"
              >
                {name}
              </h3>
            </div>
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              {kit.isOfficial && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  {officialLabel}
                </span>
              )}
              {kit.author.verified && !kit.isOfficial && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                  {verifiedLabel}
                </span>
              )}
              {kit.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </Link>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div
          role="img"
          aria-label={`평점 ${kit.rating.toFixed(1)}점 / 5점, ${kit.reviewCount}개 평가`}
          className="flex items-center gap-1"
        >
          <StarRating value={kit.rating} readOnly size="sm" />
          <span className="text-xs text-slate-400">({kit.reviewCount})</span>
        </div>
        <span className="text-xs text-slate-300">·</span>
        <span className="text-xs text-slate-500">
          {formatNumber(kit.installCount)} {installLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto">
        <DifficultyBadge difficulty={kit.difficulty} locale={locale} size="sm" />

        {onInstallClick && (
          <InstallButton
            kitId={kit.id}
            kitName={kit.displayName}
            state={installState}
            onInstall={() => onInstallClick(kit.id)}
            size="sm"
            locale={locale}
          />
        )}
      </div>
    </article>
  );
}
