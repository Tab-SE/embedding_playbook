import { Demo, Settings, FloatingAssistant } from 'components';


const SettingsPage = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Superstore Analytics': {
          path: '/superstore',
          child: {
            'Settings': {
              path: '/settings',
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
