import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { settings } from './config';

export const metadata = {
  title: settings.app_name,
  description: 'Veriforce Contractor Risk Management - Comprehensive safety and compliance tracking for contractors',
};

export default function VeriforceLayout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='veriforce'
      enableSystem={false}
      themes={[ 'veriforce' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='730bfbd6-9543-5e48-9f2b-bcb009fbb33e'
      >
        <LanguageProvider demo="veriforce">
          <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
          {children}
        </LanguageProvider>
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
