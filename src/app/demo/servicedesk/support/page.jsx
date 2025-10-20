'use client';

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
      <SupportDashboard />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

