import { Demo, FloatingAssistant } from '@/components';
import { InsightsVendors } from '../InsightsVendors';
import { settings } from '../../config';

const Page = () => {
  const pageName = 'Vendors';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <InsightsVendors />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
};

export default Page;

