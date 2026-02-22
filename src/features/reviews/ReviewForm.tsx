'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  kitId: string;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isSubmitting?: boolean;
  locale: 'ko' | 'en';
}

export function ReviewForm({ kitId, onSubmit, isSubmitting = false, locale }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const t = locale === 'ko'
    ? {
        title: '리뷰 작성',
        ratingLabel: '평점',
        commentLabel: '리뷰 내용',
        commentPlaceholder: '이 Kit에 대한 경험을 공유해주세요...',
        submit: '리뷰 등록',
        submitting: '등록 중...',
        ratingRequired: '평점을 선택해주세요',
        maxLength: '최대 1000자',
      }
    : {
        title: 'Write a Review',
        ratingLabel: 'Rating',
        commentLabel: 'Review',
        commentPlaceholder: 'Share your experience with this kit...',
        submit: 'Submit Review',
        submitting: 'Submitting...',
        ratingRequired: 'Please select a rating',
        maxLength: 'Max 1000 characters',
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  const displayRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5" data-kit-id={kitId}>
      <h3 className="text-base font-semibold text-slate-900 mb-4">{t.title}</h3>

      {/* Star Rating Input */}
      <fieldset className="mb-4">
        <legend className="text-sm font-medium text-slate-700 mb-2">{t.ratingLabel}</legend>
        <div className="flex items-center gap-1" role="radiogroup" aria-label={t.ratingLabel}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} ${locale === 'ko' ? '점' : 'star'}${value > 1 && locale === 'en' ? 's' : ''}`}
              className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-transform hover:scale-110"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  value <= displayRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-slate-300',
                )}
              />
            </button>
          ))}
        </div>
      </fieldset>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="review-comment" className="text-sm font-medium text-slate-700 mb-2 block">
          {t.commentLabel}
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 1000))}
          placeholder={t.commentPlaceholder}
          rows={3}
          maxLength={1000}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-colors"
        />
        <p className="mt-1 text-xs text-slate-400 text-right">
          {comment.length}/1000 {t.maxLength}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={rating < 1 || isSubmitting}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          rating >= 1 && !isSubmitting
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed',
        )}
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
