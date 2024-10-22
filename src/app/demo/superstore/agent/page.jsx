import { Demo, Agent } from 'components';


const AgentPage = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Superstore Analytics': {
          path: '/superstore',
          child: {
            'Agent': {
              path: '/agent',
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
