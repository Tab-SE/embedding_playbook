import { Demo, FloatingAssistant } from '@/components';
import { CustomVendors } from '../CustomVendors';
import { settings } from '../../config';

const Page = () => {
  const pageName = 'Vendors';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <CustomVendors />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
};

export default Page;

