import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { settings } from './config';

export const metadata = {
  title: settings.app_name,
  description: 'Demo Contractor Risk Management - Comprehensive safety and compliance tracking for contractors',
};

export default function ContractorLayout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='contractor'
      enableSystem={false}
      themes={[ 'contractor' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='730bfbd6-9543-5e48-9f2b-bcb009fbb33e'
      >
        <LanguageProvider demo="contractor">
          <AuthGuard demo={settings.app_id} base_path={settings.base_path} />
          {children}
        </LanguageProvider>
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
