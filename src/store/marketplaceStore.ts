import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import type { KitCategory, InstallState } from '@/types';

interface InstalledKit {
  kitId: string;
  kitName: string;
  version: string;
  installedAt: string;
  status: 'installed' | 'update_available' | 'error';
}

interface MarketplaceState {
  _hydrated: boolean;
  selectedRole: KitCategory | null;
  onboardingCompleted: boolean;
  preferredLocale: 'ko' | 'en';
  installedKits: InstalledKit[];
  recentSearches: string[];
  currentInstall: {
    kitName: string | null;
    state: InstallState;
    error: string | null;
  };

  setSelectedRole: (role: KitCategory) => void;
  completeOnboarding: () => void;
  setPreferredLocale: (locale: 'ko' | 'en') => void;
  addInstalledKit: (kit: InstalledKit) => void;
  removeInstalledKit: (kitId: string) => void;
  updateKitStatus: (kitId: string, status: InstalledKit['status']) => void;
  setInstallState: (kitName: string | null, state: InstallState, error?: string | null) => void;
  addRecentSearch: (query: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set) => ({
      _hydrated: false,
      selectedRole: null,
      onboardingCompleted: false,
      preferredLocale: 'ko',
      installedKits: [],
      recentSearches: [],
      currentInstall: { kitName: null, state: 'idle', error: null },

      setSelectedRole: (role) => set({ selectedRole: role }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      setPreferredLocale: (locale) => set({ preferredLocale: locale }),
      addInstalledKit: (kit) =>
        set((s) => ({
          installedKits: [
            ...s.installedKits.filter((k) => k.kitId !== kit.kitId),
            kit,
          ],
        })),
      removeInstalledKit: (kitId) =>
        set((s) => ({ installedKits: s.installedKits.filter((k) => k.kitId !== kitId) })),
      updateKitStatus: (kitId, status) =>
        set((s) => ({
          installedKits: s.installedKits.map((k) =>
            k.kitId === kitId ? { ...k, status } : k
          ),
        })),
      setInstallState: (kitName, state, error = null) =>
        set({ currentInstall: { kitName, state, error } }),
      addRecentSearch: (query) =>
        set((s) => ({
          recentSearches: [
            query,
            ...s.recentSearches.filter((q) => q !== query),
          ].slice(0, 5),
        })),
    }),
    {
      name: 'starter-kit-marketplace',
      partialize: (state) => ({
        selectedRole: state.selectedRole,
        onboardingCompleted: state.onboardingCompleted,
        preferredLocale: state.preferredLocale,
        installedKits: state.installedKits,
        recentSearches: state.recentSearches,
      }),
      onRehydrateStorage: () => () => {
        useMarketplaceStore.setState({ _hydrated: true });
      },
    },
  ),
);

// Hook to safely use store values after hydration (prevents SSR mismatch)
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
