import { Demo, Agent } from 'components';

import { settings } from 'components/Demo/settings';


const AgentPage = () => {
  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ': {
          path: '/',
          child: {
            'Agent': {
              path: 'agent',
              child: null
            }
          }
        }
      }}
    >
      <Agent />
    </Demo>
  )
}

export default AgentPage;
