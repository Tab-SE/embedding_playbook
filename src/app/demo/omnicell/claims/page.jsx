import { Demo, FloatingAssistant } from '@/components';

import { Customers } from './Customers';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Claims';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Customers />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
