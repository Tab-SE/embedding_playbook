"use client";

import { ThemeProvider } from 'next-themes';
import { AuthGuard, LanggraphAgentRuntimeProvider, FloatingPanelProvider } from '@/components';
import { ProgressProvider } from '@/components/Agent/ProgressContext';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme='driven-brands'
      enableSystem={false}
      themes={['driven-brands', 'take5', 'meineke', 'maaco']}
    >
      <ProgressProvider>
        <LanggraphAgentRuntimeProvider
          agentId='a585b681-26dd-5c0a-b77f-47a0e69b1bbd'
        >
          <FloatingPanelProvider>
            <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
            {children}
          </FloatingPanelProvider>
        </LanggraphAgentRuntimeProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}
