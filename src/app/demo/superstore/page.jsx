import { Demo, Home } from 'components';


const Superstore = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Superstore Analytics': {
          path: '/superstore',
          child: null
        }
      }}
    >
      <Home/>
    </Demo>
  )
}

export default Superstore;
