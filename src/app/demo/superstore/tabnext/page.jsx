import dynamic from 'next/dynamic';
import { Demo, FloatingAssistant } from '@/components';
import { settings } from '../config';

// Dynamically import TabNext with SSR disabled since it uses browser-only APIs (window, fetch, etc.)
const TabNext = dynamic(
  () => import('./TabNext').then((mod) => ({ default: mod.TabNext })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading Tableau Next dashboard...</div>
  }
);

const Page = () => {
  const pageName = 'tabNext Embed';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <TabNext />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  )
}

export default Page;


