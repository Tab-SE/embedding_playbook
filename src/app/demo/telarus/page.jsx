import { Demo, FloatingAssistant } from '@/components';

import { Products } from './Products';
import { settings } from './config';

const Page = () => {
  const pageName = 'Products';

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

