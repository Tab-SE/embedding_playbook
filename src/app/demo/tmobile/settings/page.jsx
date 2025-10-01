import { Demo } from '@/components';

import { Settings } from './Settings';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Settings';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <Settings/>
    </Demo>
  )
}

export default Page;
