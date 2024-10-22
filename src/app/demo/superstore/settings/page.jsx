import { Demo, Settings } from 'components';


const SettingsPage = () => {
  return (
    <Demo
      basePath='/demos'
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
    </Demo>
  )
}

export default SettingsPage;
