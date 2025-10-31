import { Demo, FloatingAssistant } from '@/components';
import { CustomProducts } from './CustomProducts';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Insights';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <CustomProducts />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
};

export default Page;

