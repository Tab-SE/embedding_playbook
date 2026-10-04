import { Demo, FloatingAnalyticsAgent } from '@/components';

import { Home } from './Home';
import { settings } from '../config';

const Page = () => {
  return (
    <Demo
      settings={settings}
      pageName="Superstore Analytics"
    >
      <Home />
      <FloatingAnalyticsAgent
        agentId={process.env.NEXT_PUBLIC_ANALYTICS_AGENT_ID || '0XxHu000001Aj8UKAS'}
      />
    </Demo>
  )
}

export default Page;
