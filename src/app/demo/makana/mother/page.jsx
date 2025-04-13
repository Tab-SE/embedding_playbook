import { Demo, FloatingAssistant } from '@/components';

import { Products } from './Products';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Mother Baby';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Products />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
