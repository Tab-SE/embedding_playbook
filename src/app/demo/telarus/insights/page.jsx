import { Demo, FloatingAssistant } from '@/components';
import { InsightsProducts } from './InsightsProducts';
import { settings } from '../config';

const Page = () => {
  const pageName = 'Insights';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <InsightsProducts />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
};

export default Page;

