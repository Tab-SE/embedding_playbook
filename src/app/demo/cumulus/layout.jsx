import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider, SessionWarning } from '@/components';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='cumulus'
      enableSystem={false}
      themes={[ 'cumulus' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='730bfbd6-9543-5e48-9f2b-bcb009fbb33e'
      >
        <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
        <SessionWarning demo={settings.app_id} base_path={settings.base_path} />
        {children}
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
