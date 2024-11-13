import { Demo, Agent } from 'components';

const AgentPage = () => {
  return (
    <Demo
      basePath="/"
      crumbs={{
        eBikes: {
          path: '/',
          child: {
            Agent: {
              path: '/agent',
              child: null,
            },
          },
        },
      }}
    >
      <Agent />
    </Demo>
  );
};

export default AgentPage;
