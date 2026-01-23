'use client'

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from 'next-auth/react';

import '../global.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, []);

  return (
    <html lang="en">
      <body className='h-screen w-screen'>
        {/* Load Tableau Embedding API v3 from CDN */}
        <Script
          src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
          strategy="beforeInteractive"
          type="module"
        />
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left'/>
            {children}
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
