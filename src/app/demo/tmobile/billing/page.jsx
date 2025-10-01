import { Demo, FloatingAssistant } from '@/components';

import { Billing } from './Billing';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Billing';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Billing/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
