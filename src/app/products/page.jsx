import { Demo, Products, FloatingAssistant } from 'components';

const ProductsPage = () => {
  return (
    <Demo
      basePath="/demo"
      crumbs={{
        'eBikes Analyics': {
          path: '/superstore',
          child: {
            Products: {
              path: '/products',
              child: null,
            },
          },
        },
      }}
    >
      <Products />
      <FloatingAssistant />
    </Demo>
  );
};

export default ProductsPage;
