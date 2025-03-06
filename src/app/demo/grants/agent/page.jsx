import { Demo, Agent } from 'components';


const AgentPage = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Grants': {
          path: '/grants',
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
