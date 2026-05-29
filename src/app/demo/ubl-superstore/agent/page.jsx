import { Demo, Agent } from '@/components';

import { settings } from '../config';

const Page = () => {

  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Agent';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Agent
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
