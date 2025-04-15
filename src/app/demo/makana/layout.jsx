import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='makana'
      enableSystem={false}
      themes={[ 'makana' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='a585b681-26dd-5c0a-b77f-47a0e69b1bbd'
      >
        <AuthGuard demo={settings.app_id} />
        {children}
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
