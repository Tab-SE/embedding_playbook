import { Demo, FloatingAssistant } from '@/components';

import { Network } from './Network';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Network';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Network/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
