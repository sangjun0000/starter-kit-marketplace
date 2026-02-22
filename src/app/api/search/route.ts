import { NextRequest, NextResponse } from 'next/server';
import { KITS } from '@/lib/data/kits';
import { toKitSummary, searchKits } from '@/lib/data/kit-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const query = searchParams.get('q') ?? '';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)));

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required', code: 'MISSING_QUERY' },
        { status: 400 },
      );
    }

    const approved = KITS.filter((k) => k.status === 'approved');
    const results = searchKits(approved, query);

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = results.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated.map(toKitSummary),
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('[GET /api/search]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
