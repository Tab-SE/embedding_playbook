'use client'

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/contexts/LanguageContext';

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
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left'/>
              {children}
            </LanguageProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
