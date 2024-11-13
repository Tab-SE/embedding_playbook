import { Demo, Customers, FloatingAssistant } from 'components';

const CustomersPage = () => {
  return (
    <Demo
      basePath="/demo"
      crumbs={{
        'eBikes Analyics': {
          path: '/superstore',
          child: {
            Customers: {
              path: '/customers',
              child: null,
            },
          },
        },
      }}
    >
      <Customers />
      <FloatingAssistant />
    </Demo>
  );
};

export default CustomersPage;
