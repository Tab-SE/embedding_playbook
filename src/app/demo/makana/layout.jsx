"use client";

import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { ProgressProvider } from '@/components/Agent/ProgressContext';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='makana'
      enableSystem={false}
      themes={[ 'makana' ]}
    >
      <ProgressProvider>
        <LanggraphAgentRuntimeProvider
          agentId='a0bbabff-36ab-5e80-87dc-c73cc0bf8840'
        >
          <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
          {children}
        </LanggraphAgentRuntimeProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}
