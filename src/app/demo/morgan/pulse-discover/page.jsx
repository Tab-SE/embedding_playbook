import dynamic from 'next/dynamic';
import { Demo, FloatingAssistant } from '@/components';
import { settings } from '../config';

// Dynamically import PulseDiscover with SSR disabled since it uses browser-only APIs
const PulseDiscover = dynamic(
  () => import('./PulseDiscover').then((mod) => ({ default: mod.PulseDiscover })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading dashboard...</div>
  }
);

const Page = () => {
  const pageName = 'Pulse Discover';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <PulseDiscover />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;

