import { Demo, Settings, FloatingAssistant } from 'components';
import { settings } from '../demo';

const Page = () => {
  const { app_name, app_logo, base_path, ai_chat, ai_avatar, sections } = settings;

  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Settings';

  return (
    <Demo
      app_name={app_name}
      base_path={base_path}
      crumbs={{
        [app_name]: {
          path: '/',
          child: {
            [pageName]: {
              path: `${pageName.toLowerCase()}`,
              child: null
            }
          }
        }
      }}
      app_logo={app_logo}
      ai_chat={ai_chat}
      ai_avatar={ai_avatar}
      sections={sections}
    >
      <Settings />
      <FloatingAssistant />
    </Demo>
  )
}

export default Page;

