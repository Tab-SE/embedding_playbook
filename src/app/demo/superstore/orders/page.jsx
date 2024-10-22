import { Demo, Orders } from 'components';


const OrdersPage = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Superstore Analytics': {
          path: '/superstore',
          child: {
            'Orders': {
              path: '/orders',
              child: null
            }
          }
        }
      }}
    >
      <Orders />
    </Demo>
  )
}

export default OrdersPage;
