import { Demo, FloatingAssistant } from '@/components';

import { PlayStudio } from './PlayStudio';
import { settings } from '../config';

const Page = () => {
  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'PlaySTUDIO';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <PlayStudio />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

