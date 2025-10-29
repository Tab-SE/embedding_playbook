import { Demo, FloatingAssistant } from '@/components';

import { AgentDashboard } from './AgentDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Agent';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <AgentDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
