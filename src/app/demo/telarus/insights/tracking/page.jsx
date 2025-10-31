import { Demo, FloatingAssistant } from '@/components';
import { InsightsOrderTracking } from '../InsightsOrderTracking';
import { settings } from '../../config';

const Page = () => {
  const pageName = 'Orders';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <InsightsOrderTracking />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
};

export default Page;

