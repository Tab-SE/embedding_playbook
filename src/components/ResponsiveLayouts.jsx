"use client";

import { useXSQuery, useSMQuery, useMDQuery, useLGQuery, useXLQuery, use2XLQuery } from 'hooks';

// tailwind CSS breakpoints used by the app
// const breakpoints = {
//   'xs': '< 640px', // Common screen height: 480px
//   'sm': '640px', // Common screen height: 640px
//   'md': '768px', // Common screen height: 800px
//   'lg': '1204px', // Common screen height: 900px
//   'xl': '1280px', // Common screen height: 1024px
//   '2xl': '> 1536px', // Common screen height: 1440px
// }

// DRY example was the chosen pattern
// https://github.com/yocontra/react-responsive?tab=readme-ov-file#easy-mode

export const XSLayout = ({ children }) => {
  const isXSLayout = useXSQuery();

  return isXSLayout ? children : null;
}

export const SMLayout = ({ children }) => {
  const isSMLayout = useSMQuery();

  return isSMLayout ? children : null;
}

export const MDLayout = ({ children }) => {
  const isMDLayout = useMDQuery();

  return isMDLayout ? children : null;
}

export const LGLayout = ({ children }) => {
  const isLGLayout = useLGQuery();

  return isLGLayout ? children : null;
}

export const XLLayout = ({ children }) => {
  const isXLLayout = useXLQuery();

  return isXLLayout ? children : null;
}

export const XL2Layout = ({ children }) => {
  const isXL2Layout = use2XLQuery();

  return isXL2Layout ? children : null;
}
