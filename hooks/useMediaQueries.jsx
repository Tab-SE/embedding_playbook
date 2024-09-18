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

// DRY example of react-responsive hooks was the chosen pattern
// https://github.com/yocontra/react-responsive?tab=readme-ov-file#easy-mode

export const useXSQuery = () =>
  useMediaQuery({ query: '(min-width: 0px) and (max-width: 639px)' });

export const useSMQuery = () =>
  useMediaQuery({ query: '(min-width: 640px) and (max-width: 767px)' });

export const useMDQuery = () =>
  useMediaQuery({ query: '(min-width: 768px) and (max-width: 1203px)' });

export const useLGQuery = () =>
  useMediaQuery({ query: '(min-width: 1204px) and (max-width: 1279px)' });

export const useXLQuery = () =>
  useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1535px)' });

export const use2XLQuery = () =>
  useMediaQuery({ query: '(min-width: 1536px) and (max-width: Infinity)' });
