import { Demo, Orders, FloatingAssistant } from 'components';

import { settings } from 'components/Demo/settings';


const OrdersPage = () => {
  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ': {
          path: '/',
          child: {
            'Orders': {
              path: 'orders',
              child: null
            }
          }
        }
      }}
    >
      <Orders />
      <FloatingAssistant />
    </Demo>
  )
}

export default OrdersPage;
