import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useSession, signIn } from "next-auth/react";
import { ThemeProvider } from 'next-themes';

import '../global.css';
import { SessionProvider, AgentRuntimeProvider, AuthGuard, FloatingAssistant } from '@/components';

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
          <ThemeProvider attribute="class" forcedTheme='light'>
            <AgentRuntimeProvider>
              <AuthGuard
                demo='documentation'
              />
              <DocumentsSession />
              <Component {...pageProps} />
              <FloatingAssistant
                settings={docs_settings}
              />
            </AgentRuntimeProvider>
          </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

// Logs users in automatically with the documents demo user (at a minimum has access to superstore)
const DocumentsSession = () => {
  const { status: session_status, data: session_data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here
      signIn('demo-user', { redirect: false, ID: 'a', demo: 'documentation' });
    }
  });

  return <></>
}
