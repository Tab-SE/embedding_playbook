import { Demo, FloatingAssistant } from '@/components';
import { AdvisorJourney } from './AdvisorJourney';
import { settings } from '../config';

export default function Page() {
  const pageName = 'Advisor Journey';

  return (
    <Demo
      settings={settings}
      pageName={pageName}
    >
      <AdvisorJourney />
      <FloatingAssistant
        settings={settings}
      />
    </Demo>
  );
}

