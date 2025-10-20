'use client';

import { Suspense } from 'react';
import { Demo, FloatingAssistant } from '@/components';

import { SupportDashboard } from './SupportDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Support';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SupportDashboard />
      </Suspense>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

