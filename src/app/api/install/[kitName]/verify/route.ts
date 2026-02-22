import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ kitName: string }>;
}

/**
 * POST /api/install/:kitName/verify
 *
 * Verifies a kit installation using the verification token issued during
 * the install session creation.
 *
 * In production this would update the Installation record's status to 'installed'
 * and set verifiedAt. For the mock layer we accept any well-formed token.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { kitName } = await params;

    let token: string | undefined;
    let version: string | undefined;
    try {
      const body = await request.json();
      token = typeof body?.token === 'string' ? body.token : undefined;
      version = typeof body?.version === 'string' ? body.version : undefined;
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY' },
        { status: 400 },
      );
    }

    if (!token || !token.startsWith('vt_')) {
      return NextResponse.json(
        { error: 'Invalid or missing verification token', code: 'INVALID_TOKEN' },
        { status: 400 },
      );
    }

    // In production: look up the Installation record by token,
    // verify it matches kitName, check expiry, then update status.
    // For mock: accept valid-looking tokens.

    return NextResponse.json({
      verified: true,
      kitName,
      version: version ?? '1.0.0',
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[POST /api/install/[kitName]/verify]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
