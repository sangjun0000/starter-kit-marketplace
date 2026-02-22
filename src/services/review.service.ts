import { api } from '@/lib/api/client';
import type { Review, ReviewFormData, RatingSummary, PaginatedResponse } from '@/types';

export const reviewService = {
  list(kitName: string, page = 1): Promise<PaginatedResponse<Review>> {
    return api.get(`/kits/${kitName}/reviews`, { page, limit: 10 });
  },

  getSummary(kitName: string): Promise<RatingSummary> {
    return api.get(`/kits/${kitName}/reviews/summary`);
  },

  create(kitName: string, data: ReviewFormData): Promise<Review> {
    return api.post(`/kits/${kitName}/reviews`, data);
  },

  markHelpful(reviewId: string): Promise<{ helpfulCount: number }> {
    return api.post(`/reviews/${reviewId}/helpful`);
  },
};
