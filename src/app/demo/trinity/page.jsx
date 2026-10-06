import { Demo, FloatingAssistant } from '@/components';

import { Home } from './Home';
import { settings } from './config';

const Page = () => {
  return (
    <Demo
      settings={settings}
      pageName=''
    >
      <Home/>
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
