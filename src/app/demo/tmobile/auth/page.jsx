import { Auth } from '@/components/Demo';

import { settings } from '../config';

const Page = () => {
  return (
    <Auth
      settings={settings}
    />
  )
}

export default Page;
