import { Demo, Pay, FloatingAssistant } from 'components';

import { settings } from 'components/Demo/settings';


const PayPage = () => {
  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ': {
          path: '/',
          child: {
            'Pay Forecaster': {
              path: 'pay',
              child: null
            }
          }
        }
      }}
    >
      <Pay />
      <FloatingAssistant />
    </Demo>
  )
}

export default PayPage;


