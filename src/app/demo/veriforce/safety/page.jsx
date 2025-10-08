import { Suspense } from 'react';
import { Demo, FloatingAssistant } from '@/components';

import { SafetyDashboard } from './SafetyDashboard';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Safety Team';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Suspense fallback={<div className="flex items-center justify-center h-64 text-white">Loading...</div>}>
        <SafetyDashboard/>
      </Suspense>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
