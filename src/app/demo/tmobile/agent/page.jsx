import { Demo } from '@/components';
import { Agent } from '@/components/Agent';

import { settings } from '../config';

const Page = () => {
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
