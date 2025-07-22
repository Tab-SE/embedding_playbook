import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='omnicell'
      enableSystem={false}
      themes={[ 'omnicell' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='3655ccfb-4a31-5b7e-aeb4-f833a5776ac1'
      >
        <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
        {children}
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
