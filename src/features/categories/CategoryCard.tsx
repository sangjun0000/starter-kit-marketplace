'use client';

import {
  Globe, Code, Server, Layers, Cloud, Smartphone, BarChart2, PenTool,
} from 'lucide-react';
import { cn, localize } from '@/lib/utils';
import type { KitCategory, LocalizedString } from '@/types';

interface CategoryCardData {
  id: KitCategory;
  name: LocalizedString;
  icon: string;
  description: LocalizedString;
  kitCount: number;
  colorClass: string;
}

interface CategoryCardProps {
  category: CategoryCardData;
  isSelected?: boolean;
  onClick: (categoryId: KitCategory) => void;
  locale: 'ko' | 'en';
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Code, Server, Layers, Cloud, Smartphone, BarChart2, PenTool,
};

const COLOR_MAP: Record<KitCategory, string> = {
  website: 'bg-blue-50 hover:bg-blue-100 border-blue-100 hover:border-blue-300',
  frontend: 'bg-purple-50 hover:bg-purple-100 border-purple-100 hover:border-purple-300',
  backend: 'bg-green-50 hover:bg-green-100 border-green-100 hover:border-green-300',
  fullstack: 'bg-amber-50 hover:bg-amber-100 border-amber-100 hover:border-amber-300',
  devops: 'bg-red-50 hover:bg-red-100 border-red-100 hover:border-red-300',
  mobile: 'bg-sky-50 hover:bg-sky-100 border-sky-100 hover:border-sky-300',
  data: 'bg-teal-50 hover:bg-teal-100 border-teal-100 hover:border-teal-300',
  content: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100 hover:border-yellow-300',
};

const ICON_COLOR_MAP: Record<KitCategory, string> = {
  website: 'text-blue-500',
  frontend: 'text-purple-500',
  backend: 'text-green-600',
  fullstack: 'text-amber-500',
  devops: 'text-red-500',
  mobile: 'text-sky-500',
  data: 'text-teal-600',
  content: 'text-yellow-600',
};

const SELECTED_MAP: Record<KitCategory, string> = {
  website: 'ring-2 ring-blue-500 border-blue-400',
  frontend: 'ring-2 ring-purple-500 border-purple-400',
  backend: 'ring-2 ring-green-500 border-green-400',
  fullstack: 'ring-2 ring-amber-500 border-amber-400',
  devops: 'ring-2 ring-red-500 border-red-400',
  mobile: 'ring-2 ring-sky-500 border-sky-400',
  data: 'ring-2 ring-teal-500 border-teal-400',
  content: 'ring-2 ring-yellow-500 border-yellow-400',
};

export function CategoryCard({
  category,
  isSelected = false,
  onClick,
  locale,
  className,
}: CategoryCardProps) {
  const IconComponent = ICON_MAP[category.icon] ?? Globe;
  const name = localize(category.name, locale);
  const description = localize(category.description, locale);
  const kitCountLabel = locale === 'ko'
    ? `Kit ${category.kitCount}개`
    : `${category.kitCount} Kits`;

  return (
    <button
      type="button"
      onClick={() => onClick(category.id)}
      aria-pressed={isSelected}
      aria-label={`${name} - ${description} - ${kitCountLabel}`}
      className={cn(
        'group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-200',
        'min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'cursor-pointer select-none',
        COLOR_MAP[category.id],
        isSelected && SELECTED_MAP[category.id],
        className,
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-2xl',
          'transition-transform group-hover:scale-110',
          ICON_COLOR_MAP[category.id],
        )}
        aria-hidden="true"
      >
        <IconComponent className="h-10 w-10" />
      </span>

      {/* Name */}
      <span className="text-sm font-semibold text-slate-800 leading-tight">
        {name}
      </span>

      {/* Description */}
      <span className="text-xs text-slate-500 leading-relaxed line-clamp-2">
        {description}
      </span>

      {/* Kit count */}
      <span className={cn('text-xs font-medium', ICON_COLOR_MAP[category.id])}>
        {kitCountLabel} &rarr;
      </span>
    </button>
  );
}
