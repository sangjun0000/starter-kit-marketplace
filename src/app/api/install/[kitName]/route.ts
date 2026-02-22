import { NextRequest, NextResponse } from 'next/server';
import { KITS } from '@/lib/data/kits';

interface RouteParams {
  params: Promise<{ kitName: string }>;
}

/**
 * POST /api/install/:kitName
 *
 * Creates an install session with a verification token.
 * Returns a deeplink, CLI command, and full kit manifest for the CLI to consume.
 *
 * In production this would create a persistent Installation record.
 * For the mock layer we generate deterministic data in-memory.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { kitName } = await params;

    const kit = KITS.find((k) => k.name === kitName && k.status === 'approved');
    if (!kit) {
      return NextResponse.json(
        { error: 'Kit not found', code: 'KIT_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Parse optional request body with validation
    const VALID_SOURCES = new Set(['deeplink', 'cli', 'api']);
    let source: string = 'deeplink';
    let clientInfo: { os?: string; claudeCodeVersion?: string } = {};
    try {
      const body = await request.json();
      if (body?.source) {
        const src = String(body.source);
        source = VALID_SOURCES.has(src) ? src : 'deeplink';
      }
      if (body?.clientInfo && typeof body.clientInfo === 'object') {
        clientInfo = {
          os: typeof body.clientInfo.os === 'string' ? body.clientInfo.os.slice(0, 50) : undefined,
          claudeCodeVersion: typeof body.clientInfo.claudeCodeVersion === 'string' ? body.clientInfo.claudeCodeVersion.slice(0, 20) : undefined,
        };
      }
    } catch {
      // Body is optional — ignore parse errors
    }

    const installationId = `inst_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const rawToken = crypto.randomUUID().replace(/-/g, '');
    const verificationToken = `vt_${rawToken}`;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    const deeplink =
      `claude-code://install-kit` +
      `?name=${encodeURIComponent(kit.name)}` +
      `&version=${encodeURIComponent(kit.version)}` +
      `&token=${encodeURIComponent(verificationToken)}`;

    const cliCommand =
      `claude kit install ${kit.name} --token ${verificationToken}`;

    return NextResponse.json(
      {
        installationId,
        verificationToken,
        deeplink,
        cliCommand,
        kit: {
          name: kit.name,
          version: kit.version,
          manifest: kit.manifest,
        },
        source,
        clientInfo,
        expiresAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/install/[kitName]]', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
