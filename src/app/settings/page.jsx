import { Demo, Settings, FloatingAssistant } from 'components';

import { settings } from 'components/Demo/settings';


const SettingsPage = () => {
  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ': {
          path: '/',
          child: {
            'Settings': {
              path: 'settings',
              child: null
            }
          }
        }
      }}
    >
      <Settings />
      <FloatingAssistant />
    </Demo>
  )
}

export default SettingsPage;
