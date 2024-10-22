import { Demo, Home, FloatingAssistant } from 'components';


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
      <FloatingAssistant />
    </Demo>
  )
}

export default Superstore;
