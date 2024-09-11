import { useState, useEffect, lazy, Suspense } from 'react';
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from 'next-themes';

import '../global.css';
import { ChatPopover } from 'components';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // This file imports global CSS and defines providers wrapping the App component

  // initializes Tanstack Query's client: https://tanstack.com/query/v4/docs/react/reference/QueryClient
  const [queryClient] = useState(new QueryClient());

  const [showDevtools, setShowDevtools] = useState(false)

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, []);

  // const ReactQueryDevtoolsProduction = lazy(async () => {
  //   const devtools = await import(
  //     "@tanstack/react-query-devtools/build/modern/production.js"
  //   );

  //   return {
  //     default: devtools.ReactQueryDevtools,
  //   };
  // });

  const ReactQueryDevtoolsProduction = lazy(() =>
    import('@tanstack/react-query-devtools/build/modern/production.js').then(
      (d) => ({
        default: d.ReactQueryDevtools,
      }),
    ),
  );

  // Session Provider: https://next-auth.js.org/getting-started/client#sessionprovider
  // Query Client Provider: https://tanstack.com/query/v4/docs/react/reference/QueryClientProvider
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen buttonPosition='bottom-left'/>
          <ThemeProvider attribute="class" forcedTheme='light'>
            <Component {...pageProps} />
            {showDevtools && (
              <Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
              </Suspense>
            )}
            <ChatPopover />
          </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
