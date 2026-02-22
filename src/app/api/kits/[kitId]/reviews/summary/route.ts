import { NextRequest, NextResponse } from 'next/server';
import { KITS } from '@/lib/data/kits';
import { computeRatingSummary } from '@/lib/data/reviews';

interface RouteParams {
  params: Promise<{ kitId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { kitId } = await params;

    const kit = KITS.find((k) => k.name === kitId && k.status === 'approved');
    if (!kit) {
      return NextResponse.json(
        { error: 'Kit not found', code: 'KIT_NOT_FOUND' },
        { status: 404 },
      );
    }

    const summary = computeRatingSummary(kitId);

    return NextResponse.json({
      average: summary.average,
      total: summary.total,
      distribution: summary.distribution,
    });
  } catch (error) {
    console.error('[GET /api/kits/[kitId]/reviews/summary]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
