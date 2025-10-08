import { Demo, FloatingAssistant } from '@/components';

import { SafetyDashboard } from './SafetyDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Safety Team';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <SafetyDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
