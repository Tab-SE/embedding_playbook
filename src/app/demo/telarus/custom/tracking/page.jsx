import { Demo, FloatingAssistant } from '@/components';
import { CustomOrderTracking } from '../CustomOrderTracking';
import { settings } from '../../config';

const Page = () => {
  const pageName = 'Orders';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <CustomOrderTracking />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
};

export default Page;

