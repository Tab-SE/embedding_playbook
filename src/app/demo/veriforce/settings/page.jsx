import { Demo, FloatingAssistant } from '@/components';

import { SettingsDashboard } from './SettingsDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Settings';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <SettingsDashboard/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
