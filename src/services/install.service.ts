import { api } from '@/lib/api/client';
import type { InstallSession } from '@/types';

export const installService = {
  createSession(kitName: string): Promise<InstallSession> {
    return api.post(`/install/${kitName}`);
  },

  verify(kitName: string, token: string): Promise<{ verified: boolean }> {
    return api.post(`/install/${kitName}/verify`, { token });
  },

  generateDeeplink(session: InstallSession): string {
    return `claude-code://install-kit?name=${encodeURIComponent(session.cliCommand)}&token=${session.verificationToken}`;
  },

  generateCliCommand(session: InstallSession): string {
    return session.cliCommand;
  },
};
