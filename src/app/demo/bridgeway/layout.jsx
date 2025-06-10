import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='bridgeway'
      enableSystem={false}
      themes={[ 'bridgeway' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='a0bbabff-36ab-5e80-87dc-c73cc0bf8840'
      >
        <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
        {children}
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
