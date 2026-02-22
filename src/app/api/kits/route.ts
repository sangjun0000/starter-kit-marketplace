import { NextRequest, NextResponse } from 'next/server';
import { KITS } from '@/lib/data/kits';
import { toKitSummary, searchKits } from '@/lib/data/kit-utils';
import type { KitCategory, KitDifficulty, KitType } from '@/types';

const VALID_CATEGORIES = new Set<string>(['website', 'frontend', 'backend', 'fullstack', 'devops', 'mobile', 'data', 'content']);
const VALID_TYPES = new Set<string>(['official', 'community']);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const rawCategory = searchParams.get('category');
    const category = (rawCategory && VALID_CATEGORIES.has(rawCategory) ? rawCategory : null) as KitCategory | null;
    const difficulty = searchParams.get('difficulty');
    const rawType = searchParams.get('type');
    const type = (rawType && VALID_TYPES.has(rawType) ? rawType : null) as KitType | null;
    const tags = searchParams.get('tags');
    const search = searchParams.get('q') ?? searchParams.get('search');
    const sort = searchParams.get('sort') ?? 'popular';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)));
    const minRating = searchParams.get('minRating');

    // Only surface approved kits publicly
    let results = KITS.filter((k) => k.status === 'approved');

    // ── Filters ────────────────────────────────────────────────────────────

    if (category) {
      results = results.filter((k) => k.category === category);
    }

    if (difficulty) {
      const d = parseInt(difficulty, 10) as KitDifficulty;
      if (d >= 1 && d <= 3) {
        results = results.filter((k) => k.difficulty === d);
      }
    }

    if (type) {
      const isOfficial = type === 'official';
      results = results.filter((k) => k.isOfficial === isOfficial);
    }

    if (tags) {
      const tagList = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      if (tagList.length > 0) {
        results = results.filter((k) => tagList.some((tag) => k.tags.includes(tag)));
      }
    }

    if (minRating) {
      const min = parseFloat(minRating);
      if (!isNaN(min)) {
        results = results.filter((k) => k.rating >= min);
      }
    }

    // ── Full-text search ───────────────────────────────────────────────────
    if (search && search.trim() !== '') {
      results = searchKits(results, search);
    }

    // ── Sort ───────────────────────────────────────────────────────────────
    // Only apply default sort when there is no active text search (search already scored)
    if (!search || search.trim() === '') {
      switch (sort) {
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'updated':
          results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          break;
        case 'name':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'popular':
        default:
          results.sort((a, b) => b.installCount - a.installCount);
      }
    }

    // ── Pagination ─────────────────────────────────────────────────────────
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = results.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated.map(toKitSummary),
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('[GET /api/kits]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
