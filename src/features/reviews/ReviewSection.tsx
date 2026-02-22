'use client';

import { useState, useCallback } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewCard } from './ReviewCard';
import { useReviews, useRatingSummary } from '@/hooks/useReviews';
import type { Review } from '@/types/review.types';

interface ReviewSectionProps {
  kitName: string;
  locale: 'ko' | 'en';
  className?: string;
}

function RatingBar({ star, count, total, locale }: { star: number; count: number; total: number; locale: 'ko' | 'en' }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const label = locale === 'ko'
    ? `${star}점: ${count}개 (${pct.toFixed(0)}%)`
    : `${star} stars: ${count} (${pct.toFixed(0)}%)`;
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 shrink-0 text-xs text-slate-500 text-right">{star}</span>
      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
      <span className="w-6 shrink-0 text-xs text-slate-400 text-right">{count}</span>
    </div>
  );
}

export function ReviewSection({ kitName, locale, className }: ReviewSectionProps) {
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const reviewsQuery = useReviews(kitName, page);
  const summaryQuery = useRatingSummary(kitName);

  // Accumulate reviews when new page data arrives
  const currentPageData = reviewsQuery.data?.data ?? [];
  const displayReviews = page === 1 ? currentPageData : [...allReviews, ...currentPageData];

  const loadMore = useCallback(() => {
    setAllReviews(displayReviews);
    setPage((p) => p + 1);
  }, [displayReviews]);

  const tKit = useTranslations('kit');
  const t = {
    title: tKit('reviews'),
    noReviews: locale === 'ko' ? '아직 리뷰가 없습니다.' : 'No reviews yet.',
    loadMore: locale === 'ko' ? '더 보기' : 'Load More',
    loadingMore: locale === 'ko' ? '불러오는 중...' : 'Loading...',
    error: locale === 'ko' ? '리뷰를 불러오지 못했습니다.' : 'Failed to load reviews.',
    outOf: '/ 5',
    ratings: locale === 'ko' ? '평가' : 'ratings',
  };

  const summary = summaryQuery.data;
  const pagination = reviewsQuery.data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  return (
    <section
      className={cn('space-y-6', className)}
      aria-labelledby="reviews-heading"
    >
      <h2 id="reviews-heading" className="text-xl font-semibold text-slate-900">
        {t.title}
        {summary && (
          <span className="ml-2 text-base font-normal text-slate-500">
            ({summary.total} {t.ratings})
          </span>
        )}
      </h2>

      {/* Rating Summary */}
      {summary && (
        <div className="flex flex-col sm:flex-row gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex flex-col items-center justify-center sm:min-w-[100px]">
            <span className="text-5xl font-bold text-slate-900">
              {summary.average.toFixed(1)}
            </span>
            <span className="text-sm text-slate-500">{t.outOf}</span>
            <StarRating value={summary.average} readOnly size="md" locale={locale} className="mt-2" />
          </div>
          <div className="flex-1 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={summary.distribution[star] ?? 0}
                total={summary.total}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review List */}
      {reviewsQuery.isLoading && page === 1 ? (
        <div className="flex items-center justify-center py-10 text-slate-400 gap-3">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span className="text-sm">{t.loadingMore}</span>
        </div>
      ) : reviewsQuery.isError ? (
        <p className="text-sm text-red-500 py-4">{t.error}</p>
      ) : displayReviews.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">{t.noReviews}</p>
      ) : (
        <div className="space-y-3" aria-live="polite">
          {displayReviews.map((review: Review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={reviewsQuery.isFetching}
          className={cn(
            'w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600',
            'hover:bg-slate-50 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'min-h-[48px]',
          )}
        >
          {reviewsQuery.isFetching ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.loadingMore}
            </span>
          ) : (
            t.loadMore
          )}
        </button>
      )}
    </section>
  );
}
