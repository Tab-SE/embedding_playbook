import { Demo, FloatingAssistant } from '@/components';

import { Operations } from './Operations';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Operations';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Operations />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
