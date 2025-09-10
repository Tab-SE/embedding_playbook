import { Demo, FloatingAssistant } from '@/components';

import { Passengers } from './Passengers';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Passengers';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Passengers />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
