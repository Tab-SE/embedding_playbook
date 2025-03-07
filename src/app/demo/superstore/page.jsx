import { Demo, Home, FloatingAssistant } from 'components';
import { settings } from './demo';


const Page = () => {
  const { app_name, app_logo, base_path, ai_chat, ai_avatar, sections } = settings;

  return (
    <Demo
      app_name={app_name}
      base_path={base_path}
      crumbs={{
        [app_name]: {
          path: '/',
          child: null
        }
      }}
      app_logo={app_logo}
      ai_chat={ai_chat}
      ai_avatar={ai_avatar}
      sections={sections}
    >
      <Home/>
      <FloatingAssistant />
    </Demo>
  )
}

export default Page;
