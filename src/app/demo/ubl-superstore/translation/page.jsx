import { Demo, FloatingAssistant } from '@/components';

import { Translation } from './Translation';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Translation';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Translation />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

