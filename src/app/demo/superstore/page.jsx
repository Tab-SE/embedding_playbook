import { Demo, FloatingAssistant } from '@/components';

import { Home } from './Home';
import { settings } from './config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
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
