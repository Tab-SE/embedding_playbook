import { Suspense } from 'react';
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
      <Suspense fallback={<div>Loading...</div>}>
        <OrderTracking />
      </Suspense>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

