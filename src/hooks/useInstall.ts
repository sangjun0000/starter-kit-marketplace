'use client';

import { useCallback } from 'react';
import { installService } from '@/services/install.service';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import type { InstallSession } from '@/types';

export function useInstall() {
  const { setInstallState, addInstalledKit } = useMarketplaceStore();

  const startInstall = useCallback(async (kitName: string): Promise<InstallSession | null> => {
    setInstallState(kitName, 'generating');
    try {
      const session = await installService.createSession(kitName);
      setInstallState(kitName, 'ready');
      return session;
    } catch {
      setInstallState(kitName, 'error', 'Failed to create install session');
      return null;
    }
  }, [setInstallState]);

  const installViaDeeplink = useCallback((session: InstallSession) => {
    const deeplink = installService.generateDeeplink(session);
    window.location.href = deeplink;
    setInstallState(null, 'installing');
  }, [setInstallState]);

  const verifyInstall = useCallback(async (session: InstallSession, kitName: string, kitVersion: string) => {
    setInstallState(kitName, 'verifying');
    try {
      const { verified } = await installService.verify(kitName, session.verificationToken);
      if (verified) {
        addInstalledKit({
          kitId: session.installationId,
          kitName,
          version: kitVersion,
          installedAt: new Date().toISOString(),
          status: 'installed',
        });
        setInstallState(kitName, 'success');
      } else {
        setInstallState(kitName, 'error', 'Verification failed');
      }
    } catch {
      setInstallState(kitName, 'error', 'Verification error');
    }
  }, [setInstallState, addInstalledKit]);

  return { startInstall, installViaDeeplink, verifyInstall };
}
