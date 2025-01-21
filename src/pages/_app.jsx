import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from 'next-themes';
import { ExtensionDataProvider } from '@/components/Providers/ExtensionDataProvider'


import '../global.css';
import { SessionProvider, FloatingAssistant } from 'components';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // This file imports global CSS and defines providers wrapping the App component

  // initializes Tanstack Query's client: https://tanstack.com/query/v4/docs/react/reference/QueryClient
  const [queryClient] = useState(new QueryClient());

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
    let zoomedIn = false;
  }, []);

/*
  // This isn't working... but would be nice to solve the one-way double click issue
  // in the extension environment
    useEffect(() => {
    const content = document.documentElement;
    if (!content) return;

    const handleDoubleClick = () => {
    zoomedIn = !zoomedIn;
    content.style.transform = zoomedIn ? 'scale(1.5)' : 'scale(1)';
    content.style.transformOrigin = 'center';
    };

    content.addEventListener('dblclick', handleDoubleClick);

    return () => {
    content.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []); */


  // Session Provider: https://next-auth.js.org/getting-started/client#sessionprovider
  // Query Client Provider: https://tanstack.com/query/v4/docs/react/reference/QueryClientProvider
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ExtensionDataProvider>
          <ReactQueryDevtools initialIsOpen buttonPosition='bottom-left'/>
          <ThemeProvider attribute="class" forcedTheme='light'>
            {/* <AgentRuntimeProvider> */}
              <Component {...pageProps} />
              {/* <FloatingAssistant /> */}
            {/* </AgentRuntimeProvider> */}
          </ThemeProvider>
        </ExtensionDataProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
