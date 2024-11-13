import { Demo, Orders, FloatingAssistant } from 'components';

const OrdersPage = () => {
  return (
    <Demo
      basePath="/demo"
      crumbs={{
        'eBikes Analyics': {
          path: '/superstore',
          child: {
            Orders: {
              path: '/orders',
              child: null,
            },
          },
        },
      }}
    >
      <Orders />
      <FloatingAssistant />
    </Demo>
  );
};

export default OrdersPage;
