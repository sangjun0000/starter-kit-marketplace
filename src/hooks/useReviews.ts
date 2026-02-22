'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import type { ReviewFormData } from '@/types';

export function useReviews(kitName: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', kitName, page],
    queryFn: () => reviewService.list(kitName, page),
    enabled: !!kitName,
  });
}

export function useRatingSummary(kitName: string) {
  return useQuery({
    queryKey: ['reviews', kitName, 'summary'],
    queryFn: () => reviewService.getSummary(kitName),
    enabled: !!kitName,
  });
}

export function useSubmitReview(kitName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewFormData) => reviewService.create(kitName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', kitName] });
      queryClient.invalidateQueries({ queryKey: ['kit', kitName] });
    },
  });
}
