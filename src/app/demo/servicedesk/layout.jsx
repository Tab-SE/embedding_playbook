import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='servicedesk'
      enableSystem={false}
      themes={[ 'servicedesk' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='730bfbd6-9543-5e48-9f2b-bcb009fbb33e'
      >
        <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
        {children}
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}

