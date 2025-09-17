import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from 'next-themes';

import '../global.css';
import { SessionProvider, FloatingAssistant } from '@/components';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  const homepage_settings = {
    ai_avatar: '/img/themes/superstore/superstore.png',
    sample_questions: [
      "What are our top-selling products this quarter?",
      "How is sales performance by region?",
      "Show me customer segment analysis",
      "What's our profit margin by category?",
      "Which products have the highest returns?",
      "How are we performing against targets?"
    ]
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
        <Component {...pageProps} />
        <FloatingAssistant
          settings={homepage_settings}
        />
      </QueryClientProvider>
    </SessionProvider>
  )
}
