import { cn } from '@/lib/utils';
import type { KitDifficulty } from '@/types';

interface DifficultyBadgeProps {
  difficulty: KitDifficulty;
  locale?: 'ko' | 'en';
  showDots?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const DIFFICULTY_CONFIG = {
  1: {
    label: { ko: '쉬움', en: 'Easy' },
    dotColor: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  2: {
    label: { ko: '보통', en: 'Medium' },
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  3: {
    label: { ko: '어려움', en: 'Hard' },
    dotColor: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
} as const;

export function DifficultyBadge({
  difficulty,
  locale = 'ko',
  showDots = true,
  size = 'sm',
  className,
}: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const label = locale === 'ko' ? config.label.ko : config.label.en;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.bgColor,
        config.borderColor,
        config.textColor,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
      aria-label={`${locale === 'ko' ? '난이도' : 'Difficulty'}: ${label}`}
    >
      {showDots && (
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3].map((level) => (
            <span
              key={level}
              className={cn(
                'rounded-full',
                size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
                level <= difficulty ? config.dotColor : 'bg-slate-200',
              )}
            />
          ))}
        </span>
      )}
      {label}
    </span>
  );
}
