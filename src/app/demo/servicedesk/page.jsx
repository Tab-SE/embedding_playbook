'use client';

import { Demo, FloatingAssistant } from '@/components';

import { Home } from './Home';
import { settings } from './config';

const Page = () => {
  const pageName = 'Home';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Home/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

