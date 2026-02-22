import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/data/categories';
import { KITS } from '@/lib/data/kits';

export async function GET() {
  try {
    // Compute live kit counts per category from the approved kits
    const countByCategory = KITS.filter((k) => k.status === 'approved').reduce<Record<string, number>>(
      (acc, kit) => {
        acc[kit.category] = (acc[kit.category] ?? 0) + 1;
        return acc;
      },
      {},
    );

    const data = CATEGORIES
      .map((cat) => ({
        ...cat,
        kitCount: countByCategory[cat.categoryId] ?? 0,
      }))
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[GET /api/categories]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
