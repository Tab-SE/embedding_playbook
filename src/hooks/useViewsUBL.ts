"use client";

import { useQuery } from '@tanstack/react-query';
import { useTableauSessionUBL } from './useTableauSessionUBL';

const fetchViews = async () => {
  const res = await fetch('/api/views/ubl');
  if (!res.ok) throw new Error('Failed to fetch views');
  return res.json();
};

export const useViewsUBL = () => {
  const { data: user } = useTableauSessionUBL();
  const hasToken = !!user?.embed_token;

  return useQuery({
    queryKey: ['tableau', 'ubl', 'views'],
    queryFn: fetchViews,
    enabled: hasToken,
    staleTime: 10 * 60 * 1000,
  });
};
