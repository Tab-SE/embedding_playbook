import { Demo, Customers } from 'components';


const CustomersPage = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Superstore Analytics': {
          path: '/superstore',
          child: {
            'Customers': {
              path: '/customers',
              child: null
            }
          }
        }
      }}
    >
      <Customers />
    </Demo>
  )
}

export default CustomersPage;
