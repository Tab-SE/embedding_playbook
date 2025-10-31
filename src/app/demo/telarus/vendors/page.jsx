import { Demo, FloatingAssistant } from '@/components';

import { Vendors } from './Vendors';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Vendors';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Vendors />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

