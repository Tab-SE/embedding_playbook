import { Demo, Products } from 'components';


const ProductsPage = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Superstore Analytics': {
          path: '/superstore',
          child: {
            'Products': {
              path: '/products',
              child: null
            }
          }
        }
      }}
    >
      <Products />
    </Demo>
  )
}

export default ProductsPage;


