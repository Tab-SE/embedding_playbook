import { Demo, FloatingAssistant } from '@/components';

import { ManagementDashboard } from './ManagementDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Management';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <ManagementDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
