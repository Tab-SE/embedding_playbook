import { Demo, FloatingAssistant } from '@/components';

import { TabNext } from './TabNext';
import { settings } from '../config';

const Page = () => {
  const pageName = 'tabNext Embed';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <TabNext />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;


