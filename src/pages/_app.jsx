import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from 'next-themes';

import '../global.css';
import { SessionProvider, VercelAgentRuntimeProvider, AuthGuard, FloatingAssistant } from '@/components';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  const docs_settings = {
    ai_avatar: '/img/themes/superstore/superstore.png'
  };

  // This file imports global CSS and defines providers wrapping the App component
  // initializes Tanstack Query's client: https://tanstack.com/query/v4/docs/react/reference/QueryClient
  const [queryClient] = useState(new QueryClient());

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, []);

  // Session Provider: https://next-auth.js.org/getting-started/client#sessionprovider
  // Query Client Provider: https://tanstack.com/query/v4/docs/react/reference/QueryClientProvider
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen buttonPosition='bottom-left'/>
          <ThemeProvider
            attribute="data-theme"
            forcedTheme='light'
            enableSystem={false}
            themes={[ 'light' ]}
          >
            <VercelAgentRuntimeProvider>
              <AuthGuard
                demo='documentation'
              />
              <Component {...pageProps} />
              <FloatingAssistant
                settings={docs_settings}
              />
            </VercelAgentRuntimeProvider>
          </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
