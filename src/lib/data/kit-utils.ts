import type { KitSummary } from '@/types';
import type { KITS } from './kits';

export function toKitSummary(kit: (typeof KITS)[number]): KitSummary {
  return {
    id: kit.id,
    name: kit.name,
    displayName: kit.displayName,
    description: kit.description,
    category: kit.category,
    difficulty: kit.difficulty,
    icon: kit.icon,
    author: kit.author,
    isOfficial: kit.isOfficial,
    version: kit.version,
    rating: kit.rating,
    reviewCount: kit.reviewCount,
    installCount: kit.installCount,
    tags: kit.tags,
  };
}

export function searchKits(
  kits: (typeof KITS)[number][],
  query: string,
): (typeof KITS)[number][] {
  const terms = query.trim().toLowerCase().split(/\s+/);
  return kits
    .map((kit) => {
      let score = 0;
      for (const term of terms) {
        if (kit.name.includes(term)) score += 3;
        if (kit.displayName.ko?.toLowerCase().includes(term)) score += 3;
        if (kit.displayName.en.toLowerCase().includes(term)) score += 3;
        if (kit.description.ko?.toLowerCase().includes(term)) score += 2;
        if (kit.description.en.toLowerCase().includes(term)) score += 2;
        if (kit.tags.some((tag) => tag.includes(term))) score += 2;
        if (kit.author.name.toLowerCase().includes(term)) score += 1;
      }
      return { kit, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ kit }) => kit);
}
