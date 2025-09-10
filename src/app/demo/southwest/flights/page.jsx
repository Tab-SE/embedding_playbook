import { Demo, FloatingAssistant } from '@/components';

import { Flights } from './Flights';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Flights';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Flights />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
