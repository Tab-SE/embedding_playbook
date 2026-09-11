import { FloatingAssistant } from '@/components';
import { DrivenBrandsDemo } from './DrivenBrandsDemo';
import { Home } from './Home';
import { settings } from './config';

const Page = () => {
  return (
    <DrivenBrandsDemo pageName=''>
      <Home />
      <FloatingAssistant settings={settings} />
    </DrivenBrandsDemo>
  )
}

export default Page;
