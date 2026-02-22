import { api } from '@/lib/api/client';
import type { KitSummary, KitDetail, KitListParams, PaginatedResponse } from '@/types';

export const kitService = {
  list(params: KitListParams = {}): Promise<PaginatedResponse<KitSummary>> {
    return api.get('/kits', {
      category: params.category,
      difficulty: params.difficulty ? String(params.difficulty) : undefined,
      type: params.type,
      tags: params.tags?.join(','),
      q: params.search,
      sort: params.sort ?? 'popular',
      page: params.page ?? 1,
      limit: params.limit ?? 12,
    });
  },

  getByName(name: string): Promise<KitDetail> {
    return api.get(`/kits/${name}`);
  },

  getPopular(limit = 6): Promise<PaginatedResponse<KitSummary>> {
    return api.get('/kits', { sort: 'popular', limit });
  },

  getNewest(limit = 6): Promise<PaginatedResponse<KitSummary>> {
    return api.get('/kits', { sort: 'newest', limit });
  },

  search(query: string, page = 1): Promise<PaginatedResponse<KitSummary>> {
    return api.get('/search', { q: query, page });
  },
};
