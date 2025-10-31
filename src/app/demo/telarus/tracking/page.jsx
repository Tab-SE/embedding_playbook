import { Demo, FloatingAssistant } from '@/components';

import { OrderTracking } from './OrderTracking';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Orders';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <OrderTracking />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

