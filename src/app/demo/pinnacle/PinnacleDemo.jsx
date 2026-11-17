"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Demo } from '@/components';
import { settings } from './config';

export const PinnacleDemo = ({ children, pageName }) => {
  const { setTheme } = useTheme();

  // Explicitly set theme on mount so cached themes from other demos don't bleed in.
  useEffect(() => {
    setTheme('pinnacle');
  }, [setTheme]);

  return (
    <Demo settings={settings} pageName={pageName}>
      {children}
    </Demo>
  );
};
