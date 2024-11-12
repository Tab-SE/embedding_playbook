import { Demo, Home, FloatingAssistant } from 'components';

import { settings } from 'components/Demo/settings';


const Superstore = () => {
   const app_name = settings.app_name

  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ' : {
          path: '/',
          child: null
        }
      }}
    >
      <Home/>
      <FloatingAssistant />
    </Demo>
  )
}

export default Superstore;
