import { useMediaQuery } from 'react-responsive';

// tailwind CSS breakpoints used by the app
// https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints
// const breakpoints = {
//   'xs': '< 640px',
//   'sm': '640px',
//   'md': '768px',
//   'lg': '1204px',
//   'xl': '1280px',
//   '2xl': '> 1536px',
// }

// sample layouts prop
// const breakpoints = {
//   'xs': { 'device': 'phone', 'width': 360, 'height': 420 },
//   'sm': { 'device': 'tablet', 'width': 640, 'height': 420 },
//   'md': { 'device': 'tablet', 'width': 768, 'height': 540 },
//   'lg': { 'device': 'tablet', 'width': 1200, 'height': 700 },
//   'xl': { 'device': 'desktop', 'width': 1260, 'height': 700 },
//   '2xl': { 'device': 'desktop', 'width': 1530, 'height': 800},
// }

// DRY example of react-responsive hooks was the chosen pattern
// https://github.com/yocontra/react-responsive?tab=readme-ov-file#easy-mode

export const useXSQuery = () =>
  useMediaQuery({ query: '(max-width: 639px)' });

export const useSMQuery = () =>
  useMediaQuery({ query: '(min-width: 640px)' });

export const useMDQuery = () =>
  useMediaQuery({ query: '(min-width: 768px)' });

export const useLGQuery = () =>
  useMediaQuery({ query: '(min-width: 1204px)' });

export const useXLQuery = () =>
  useMediaQuery({ query: '(min-width: 1280px)' });

export const use2XLQuery = () =>
  useMediaQuery({ query: '(min-width: 1536px)' });
