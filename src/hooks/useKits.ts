'use client';

import { useQuery } from '@tanstack/react-query';
import { kitService } from '@/services/kit.service';
import type { KitListParams } from '@/types';

export function useKitList(params: KitListParams = {}) {
  return useQuery({
    queryKey: ['kits', params],
    queryFn: () => kitService.list(params),
  });
}

export function useKitDetail(name: string) {
  return useQuery({
    queryKey: ['kit', name],
    queryFn: () => kitService.getByName(name),
    enabled: !!name,
  });
}

export function usePopularKits(limit = 6) {
  return useQuery({
    queryKey: ['kits', 'popular', limit],
    queryFn: () => kitService.getPopular(limit),
  });
}

export function useNewestKits(limit = 6) {
  return useQuery({
    queryKey: ['kits', 'newest', limit],
    queryFn: () => kitService.getNewest(limit),
  });
}
