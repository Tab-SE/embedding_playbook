import { useMediaQuery } from 'react-responsive';

// tailwind CSS breakpoints used by the app
// const breakpoints = {
//   'xs': '< 640px', // Common screen height: 480px
//   'sm': '640px', // Common screen height: 640px
//   'md': '768px', // Common screen height: 800px
//   'lg': '1204px', // Common screen height: 900px
//   'xl': '1280px', // Common screen height: 1024px
//   '2xl': '> 1536px', // Common screen height: 1440px
// }

// DRY example of react-responsive hooks was the chosen pattern
// https://github.com/yocontra/react-responsive?tab=readme-ov-file#easy-mode

export const useXSQuery = () =>
  useMediaQuery({ query: '(min-width: 0px) and (max-width: 639px)' });

export const useSMQuery = () =>
  useMediaQuery({ query: '(min-width: 640px) and (max-width: 767px)' });

export const useMDQuery = () =>
  useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });

export const useLGQuery = () =>
  useMediaQuery({ query: '(min-width: 1024px) and (max-width: 1279px)' });

export const useXLQuery = () =>
  useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1535px)' });

export const use2XLQuery = () =>
  useMediaQuery({ query: '(min-width: 1536px)' });
