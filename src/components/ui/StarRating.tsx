'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  locale?: 'ko' | 'en';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
  locale = 'ko',
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const isInteractive = !readOnly && !!onChange;
  const displayValue = hovered ?? value;

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={locale === 'ko' ? `평점 ${value.toFixed(1)}점 / 5점` : `Rating ${value.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;
        const isPartial = !isFilled && star - 1 < displayValue && displayValue < star;

        if (isInteractive) {
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === Math.round(value)}
              aria-label={`${star}점`}
              className={cn(
                'cursor-pointer transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded',
                'hover:scale-110',
              )}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onChange?.(star)}
            >
              <Star
                className={cn(
                  SIZE_MAP[size],
                  'transition-colors',
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-slate-300',
                )}
              />
            </button>
          );
        }

        return (
          <span key={star} aria-hidden="true" className="relative">
            {isPartial ? (
              <span className="relative">
                <Star className={cn(SIZE_MAP[size], 'fill-transparent text-slate-300')} />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(displayValue - (star - 1)) * 100}%` }}
                >
                  <Star className={cn(SIZE_MAP[size], 'fill-amber-400 text-amber-400')} />
                </span>
              </span>
            ) : (
              <Star
                className={cn(
                  SIZE_MAP[size],
                  isFilled ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300',
                )}
              />
            )}
          </span>
        );
      })}

      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
