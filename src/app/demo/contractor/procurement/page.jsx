import { Demo, FloatingAssistant } from '@/components';

import { ProcurementDashboard } from './ProcurementDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Procurement';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <ProcurementDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
