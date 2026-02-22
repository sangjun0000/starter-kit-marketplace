'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { kitService } from '@/services/kit.service';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useSearch(query: string, page = 1) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['search', debouncedQuery, page],
    queryFn: () => kitService.search(debouncedQuery, page),
    enabled: debouncedQuery.length >= 2,
  });
}
