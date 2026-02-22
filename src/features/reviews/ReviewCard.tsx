'use client';

import { ThumbsUp, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import type { Review } from '@/types/review.types';

interface ReviewCardProps {
  review: Review;
  locale: 'ko' | 'en';
  className?: string;
}

function formatRelativeDate(dateStr: string, locale: 'ko' | 'en'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (locale === 'ko') {
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  } else {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
}

export function ReviewCard({ review, locale, className }: ReviewCardProps) {
  const { t } = useI18n();
  const helpfulLabel = t('review.helpful');
  const verifiedLabel = t('review.verified');
  const versionLabel = t('kit.version');

  return (
    <article
      className={cn(
        'rounded-xl border border-slate-100 bg-white p-5',
        className,
      )}
      aria-label={`${review.userName}의 리뷰, 평점 ${review.rating}점`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar placeholder */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm"
            aria-hidden="true"
          >
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-900">{review.userName}</span>
              {review.isVerified && (
                <span
                  className="inline-flex items-center gap-0.5 text-xs text-green-600"
                  title={verifiedLabel}
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{verifiedLabel}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{formatRelativeDate(review.createdAt, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating value={review.rating} readOnly size="sm" />
          <span className="text-xs text-slate-400">
            {versionLabel} {review.version}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>

      {/* Footer */}
      {review.helpfulCount > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {locale === 'ko'
              ? `${review.helpfulCount}명에게 도움됨`
              : `${review.helpfulCount} found this ${helpfulLabel.toLowerCase()}`}
          </span>
        </div>
      )}
    </article>
  );
}
