import { NextRequest, NextResponse } from 'next/server';
import { KITS } from '@/lib/data/kits';

interface RouteParams {
  params: Promise<{ kitId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { kitId } = await params;

    // kitId is the kit slug/name (e.g. "frontend-developer-kit")
    const kit = KITS.find((k) => k.name === kitId && k.status === 'approved');

    if (!kit) {
      return NextResponse.json(
        { error: 'Kit not found', code: 'KIT_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Return KitDetail shape with the raw manifest attached
    return NextResponse.json({
      id: kit.id,
      name: kit.name,
      displayName: kit.displayName,
      version: kit.version,
      description: kit.description,
      category: kit.category,
      difficulty: kit.difficulty,
      icon: kit.icon,
      author: kit.author,
      isOfficial: kit.isOfficial,
      tags: kit.tags,
      includes: kit.includes,
      onInstall: kit.onInstall,
      requires: kit.requires,
      rating: kit.rating,
      reviewCount: kit.reviewCount,
      installCount: kit.installCount,
      status: kit.status,
      manifest: kit.manifest,
      createdAt: kit.createdAt,
      updatedAt: kit.updatedAt,
    });
  } catch (error) {
    console.error('[GET /api/kits/[kitId]]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
