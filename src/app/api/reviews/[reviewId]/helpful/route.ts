import { NextRequest, NextResponse } from 'next/server';
import { REVIEWS } from '@/lib/data/reviews';

interface RouteParams {
  params: Promise<{ reviewId: string }>;
}

/**
 * POST /api/reviews/:reviewId/helpful
 *
 * Marks a review as helpful. In production this would persist a unique
 * user+review helpful record. In the mock layer we return a simulated
 * incremented count.
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { reviewId } = await params;

    const review = REVIEWS.find((r) => r.id === reviewId && r.status === 'active');
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found', code: 'REVIEW_NOT_FOUND' },
        { status: 404 },
      );
    }

    // In the mock layer we return the current count + 1 (not persisted)
    return NextResponse.json({ helpfulCount: review.helpfulCount + 1 });
  } catch (error) {
    console.error('[POST /api/reviews/[reviewId]/helpful]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
