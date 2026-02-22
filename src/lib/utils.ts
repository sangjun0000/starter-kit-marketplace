import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { LocalizedString } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localize(str: LocalizedString, locale: string): string {
  if (locale === 'ko' && str.ko) return str.ko;
  return str.en;
}

export function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function difficultyLabel(difficulty: number, locale: string): string {
  const labels: Record<string, string[]> = {
    ko: ['쉬움', '보통', '어려움'],
    en: ['Easy', 'Medium', 'Hard'],
  };
  return (labels[locale] ?? labels.en)[difficulty - 1] ?? '';
}
