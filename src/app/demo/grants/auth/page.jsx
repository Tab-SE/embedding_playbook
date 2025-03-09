import { Auth } from 'components';
import { settings } from '../config';


const AuthPage = () => {
  const { app_name, app_logo, base_path, ai_chat, ai_avatar, sections, auth_hero, users } = settings;

  return (
    <Auth
      app_name={app_name}
      base_path={base_path}
      app_logo={app_logo}
      ai_chat={ai_chat}
      ai_avatar={ai_avatar}
      sections={sections}
      auth_hero={auth_hero}
      users={users}
    />
  )
}

export default AuthPage;
