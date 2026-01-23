import dynamic from 'next/dynamic';
import { Demo, FloatingAssistant } from '@/components';
import { settings } from '../config';

// Dynamically import PulseMetrics with SSR disabled since it uses browser-only APIs
const PulseMetrics = dynamic(
  () => import('./PulseMetrics').then((mod) => ({ default: mod.PulseMetrics })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading Pulse metrics...</div>
  }
);

const Page = () => {
  const pageName = 'Pulse Metrics';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <PulseMetrics />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;
