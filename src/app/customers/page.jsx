import { Demo, Customers, FloatingAssistant } from 'components';

import { settings } from 'components/Demo/settings';


const CustomersPage = () => {
  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ': {
          path: '/',
          child: {
            'Customers': {
              path: 'customers',
              child: null
            }
          }
        }
      }}
    >
      <Customers />
      <FloatingAssistant />
    </Demo>
  )
}

export default CustomersPage;
