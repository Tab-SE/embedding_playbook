import { Demo, FloatingAssistant } from '@/components';

import { ReportsDashboard } from './ReportsDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Reports';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <ReportsDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
