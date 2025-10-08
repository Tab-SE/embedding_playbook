import { Auth } from '@/components';

import { settings } from '../config';

const AuthPage = () => {
  return (
    <Auth
      settings={settings}
    />
  )
}

export default AuthPage;
