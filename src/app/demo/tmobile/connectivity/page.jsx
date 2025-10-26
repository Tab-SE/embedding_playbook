import { Demo, FloatingAssistant } from '@/components';

import { Connectivity } from './Connectivity';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Connectivity';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Connectivity/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
