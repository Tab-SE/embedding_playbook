import { Demo, FloatingAssistant } from '@/components';

import { ClientPortfolio, Products } from './ClientPortfolio';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Client Portfolio';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <ClientPortfolio />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
