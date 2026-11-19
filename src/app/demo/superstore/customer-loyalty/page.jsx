import dynamic from 'next/dynamic';
import { Demo, FloatingAssistant } from '@/components';
import { settings } from '../config';

// Dynamically import with SSR disabled since the embed uses browser-only APIs
const CustomerLoyalty = dynamic(
  () => import('./CustomerLoyalty').then((mod) => ({ default: mod.CustomerLoyalty })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading data app...</div>
  }
);

const Page = () => {
  const pageName = 'Customer Loyalty';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <CustomerLoyalty />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
