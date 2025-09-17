import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';

// Homepage settings - using Superstore theme and agent
const homepage_settings = {
  app_id: 'superstore',
  base_path: '/',
  ai_avatar: '/img/themes/superstore/superstore.png',
  sample_questions: [
    "What are our top-selling products this quarter?",
    "How is sales performance by region?",
    "Show me customer segment analysis",
    "What's our profit margin by category?",
    "Which products have the highest returns?",
    "How are we performing against targets?"
  ]
};

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      forcedTheme='superstore'
      enableSystem={false}
      themes={[ 'superstore' ]}
    >
      <LanggraphAgentRuntimeProvider
        agentId='a585b681-26dd-5c0a-b77f-47a0e69b1bbd'
      >
        <AuthGuard demo={homepage_settings.app_id} base_path={homepage_settings.base_path} />
        {children}
      </LanggraphAgentRuntimeProvider>
    </ThemeProvider>
  );
}
