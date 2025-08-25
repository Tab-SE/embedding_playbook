import { Demo, FloatingAssistant } from '@/components';

import { Settings } from './Settings';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Settings';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Settings />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
