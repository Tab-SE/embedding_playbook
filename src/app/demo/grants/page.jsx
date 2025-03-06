import { Demo, Home, FloatingAssistant } from 'components';


const Grants = () => {
  return (
    <Demo
      basePath='/demo'
      crumbs={{
        'Grants': {
          path: '/grants',
          child: null
        }
      }}
    >
      <Home/>
      <FloatingAssistant />
    </Demo>
  )
}

export default Grants;
