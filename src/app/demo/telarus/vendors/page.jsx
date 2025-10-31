import { Suspense } from 'react';
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
      <Suspense fallback={<div>Loading...</div>}>
        <Vendors />
      </Suspense>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

