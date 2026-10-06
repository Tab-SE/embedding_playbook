"use client";

import { useQuery } from '@tanstack/react-query';
import { useTableauSession } from './useTableauSession';

const fetchViews = async () => {
  const res = await fetch('/api/views');
  if (!res.ok) throw new Error('Failed to fetch views');
  return res.json();
};

export const useViews = () => {
  const { data: user } = useTableauSession();
  const hasToken = !!user?.embed_token;

  return useQuery({
    queryKey: ['tableau', 'views'],
    queryFn: fetchViews,
    enabled: hasToken,
    staleTime: 10 * 60 * 1000,
  });
};
