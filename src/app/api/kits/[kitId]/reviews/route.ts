import { NextRequest, NextResponse } from 'next/server';
import { KITS } from '@/lib/data/kits';
import { REVIEWS, computeRatingSummary } from '@/lib/data/reviews';
import type { Review } from '@/types';

const MAX_COMMENT_LENGTH = 1000;

interface RouteParams {
  params: Promise<{ kitId: string }>;
}

type ReviewSortKey = 'newest' | 'helpful' | 'highest' | 'lowest';

function sortReviews(reviews: typeof REVIEWS, sort: ReviewSortKey): typeof REVIEWS {
  const copy = [...reviews];
  switch (sort) {
    case 'helpful':
      return copy.sort((a, b) => b.helpfulCount - a.helpfulCount);
    case 'highest':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'lowest':
      return copy.sort((a, b) => a.rating - b.rating);
    case 'newest':
    default:
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

function toReviewDto(r: (typeof REVIEWS)[number]): Review {
  return {
    id: r.id,
    kitId: r.kitId,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    version: r.version,
    isVerified: r.isVerified,
    helpfulCount: r.helpfulCount,
    createdAt: r.createdAt,
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { kitId } = await params;

    const kit = KITS.find((k) => k.name === kitId && k.status === 'approved');
    if (!kit) {
      return NextResponse.json(
        { error: 'Kit not found', code: 'KIT_NOT_FOUND' },
        { status: 404 },
      );
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10)));
    const sort = (searchParams.get('sort') ?? 'newest') as ReviewSortKey;
    const ratingFilter = searchParams.get('rating');

    let reviews = REVIEWS.filter((r) => r.kitName === kitId && r.status === 'active');

    if (ratingFilter) {
      const rating = parseInt(ratingFilter, 10);
      if (rating >= 1 && rating <= 5) {
        reviews = reviews.filter((r) => r.rating === rating);
      }
    }

    reviews = sortReviews(reviews, sort);

    const total = reviews.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = reviews.slice(offset, offset + limit);

    // Compute summary on the full (unfiltered-by-rating) set
    const allKitReviews = REVIEWS.filter((r) => r.kitName === kitId && r.status === 'active');
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    let sum = 0;
    for (const r of allKitReviews) {
      distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
      sum += r.rating;
    }
    const averageRating = allKitReviews.length > 0
      ? Math.round((sum / allKitReviews.length) * 10) / 10
      : 0;

    return NextResponse.json({
      data: paginated.map(toReviewDto),
      summary: {
        averageRating,
        totalCount: allKitReviews.length,
        distribution,
      },
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('[GET /api/kits/[kitId]/reviews]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim();
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { kitId } = await params;

    const kit = KITS.find((k) => k.name === kitId && k.status === 'approved');
    if (!kit) {
      return NextResponse.json(
        { error: { code: 'KIT_NOT_FOUND', message: 'Kit not found' } },
        { status: 404 },
      );
    }

    let body: { rating?: unknown; comment?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: 'INVALID_JSON', message: 'Invalid request body' } },
        { status: 400 },
      );
    }

    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Rating must be an integer between 1 and 5' } },
        { status: 400 },
      );
    }

    const rawComment = typeof body.comment === 'string' ? body.comment : '';
    const comment = sanitizeText(rawComment);

    if (comment.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: `Comment must be ${MAX_COMMENT_LENGTH} characters or less` } },
        { status: 400 },
      );
    }

    const newReview: Review = {
      id: `rev_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
      kitId: kit.id,
      userId: `user_anonymous`,
      userName: 'Anonymous',
      rating,
      comment,
      version: kit.version,
      isVerified: false,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('[POST /api/kits/[kitId]/reviews]', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
