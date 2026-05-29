import { Demo, FloatingAssistant, FloatingAnalyticsAgent } from '@/components';

import { Home } from './Home';
import { settings } from './config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = '';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Home/>
      <FloatingAnalyticsAgent
        agentId={process.env.NEXT_PUBLIC_ANALYTICS_AGENT_ID || '0XxHu000001Aj8UKAS'}
      />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
