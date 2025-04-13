import { Demo, FloatingAssistant } from '@/components';

import { Orders } from './Orders';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Member Utilization';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Orders />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
