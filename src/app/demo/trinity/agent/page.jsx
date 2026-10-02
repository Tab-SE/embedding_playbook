import { Demo, Agent } from '@/components';

import { settings } from '../config';

const Page = () => {
  return (
    <Demo settings={settings} pageName="Agent">
      <Agent settings={settings} />
    </Demo>
  )
}

export default Page;
