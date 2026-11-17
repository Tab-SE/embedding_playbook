import { FloatingAssistant } from '@/components';
import { PinnacleDemo } from './PinnacleDemo';
import { Home } from './Home';
import { settings } from './config';

const Page = () => {
  return (
    <PinnacleDemo pageName=''>
      <Home />
      <FloatingAssistant settings={settings} />
    </PinnacleDemo>
  );
}

export default Page;
