"use client";

import { useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Demo } from '@/components';
import { useTableauSession } from '@/hooks';
import { settings } from './config';

const REGION_TO_BRAND = {
  East:    'Take 5 Oil Change',
  South:   'Take 5 Oil Change',
  Central: 'Meineke',
  West:    'Maaco',
};

// Maps brand name → CSS theme key
const BRAND_THEME = {
  'Take 5 Oil Change': 'take5',
  'Meineke':           'meineke',
  'Maaco':             'maaco',
};

function getSingleBrand(regions) {
  if (!regions || regions.length === 0) return null;
  const brands = [...new Set(regions.map(r => REGION_TO_BRAND[r]).filter(Boolean))];
  return brands.length === 1 ? brands[0] : null;
}

export const DrivenBrandsDemo = ({ children, pageName }) => {
  const { data: session } = useTableauSession();
  const { setTheme } = useTheme();
  const regions = session?.uaf?.Region ?? [];
  const singleBrand = getSingleBrand(regions);

  // Switch theme as soon as we know the user's brand scope
  useEffect(() => {
    if (!session) return;
    const theme = singleBrand ? (BRAND_THEME[singleBrand] ?? 'driven-brands') : 'driven-brands';
    setTheme(theme);
  }, [session, singleBrand, setTheme]);

  const resolvedSettings = useMemo(() => {
    if (!singleBrand) return settings;
    const brandLogo = settings.brand_logos[singleBrand];
    return brandLogo ? { ...settings, app_logo: brandLogo } : settings;
  }, [singleBrand]);

  return (
    <Demo settings={resolvedSettings} pageName={pageName}>
      {children}
    </Demo>
  );
};
