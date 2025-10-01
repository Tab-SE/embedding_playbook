import { Demo, FloatingAssistant } from '@/components';

import { Customers } from './Customers';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Customers';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Customers/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
