import { Demo, FloatingAssistant } from 'components';
import { Orders } from './Orders';
import { settings } from '../config';

const Page = () => {
  const { app_name, app_logo, base_path, ai_chat, ai_avatar, sections } = settings;

  // for the most part, only the pageName and child components for <Demo/> should be modified to make new pages
  const pageName = 'Orders';

  return (
    <Demo
      app_name={app_name}
      base_path={base_path}
      crumbs={{
        [app_name]: {
          path: '/',
          child: {
            [pageName]: {
              path: `${pageName ? pageName.toLowerCase() : ''}`,
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
      <Orders />
      <FloatingAssistant
        ai_avatar={ai_avatar}
      />
    </Demo>
  )
}

export default Page;
