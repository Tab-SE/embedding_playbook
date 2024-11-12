import { Demo, Products, FloatingAssistant } from 'components';

import { settings } from 'components/Demo/settings';


const ProductsPage = () => {
  return (
    <Demo
      basePath={settings.base_path}
      crumbs={{
        'Pacifica CPQ': {
          path: '/',
          child: {
            'Products': {
              path: 'products',
              child: null
            }
          }
        }
      }}
    >
      <Products />
      <FloatingAssistant />
    </Demo>
  )
}

export default ProductsPage;


