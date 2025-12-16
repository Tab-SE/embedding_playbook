import { Demo, FloatingAssistant } from '@/components';

import { AlertsDashboard } from './AlertsDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Alerts';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <AlertsDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
